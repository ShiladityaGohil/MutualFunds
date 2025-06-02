import sys
import requests
import psycopg2
from psycopg2.extras import Json
import time
import logging
import threading
import os
from urllib.parse import urlparse
import config

# Ensure logs directory exists
logs_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')
os.makedirs(logs_dir, exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(logs_dir, "mutual_funds_update.log")),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("mutual_funds_updater")

# Get database configuration from environment variables or config
def get_db_config():
    # If DATABASE_URL is provided (like on Render), parse it
    if os.getenv('DATABASE_URL'):
        db_url = os.getenv('DATABASE_URL')
        # Handle Render's postgres:// format
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
            
        url = urlparse(db_url)
        return {
            "dbname": url.path[1:],
            "user": url.username,
            "password": url.password,
            "host": url.hostname,
            "port": url.port or 5432
        }
    # Otherwise use individual environment variables
    else:
        return {
            "dbname": os.getenv('DB_NAME', 'postgres'),
            "user": os.getenv('DB_USER', 'postgres'),
            "password": os.getenv('DB_PASSWORD', 'postgres'),
            "host": os.getenv('DB_HOST', 'localhost'),
            "port": int(os.getenv('DB_PORT', 5432))
        }

# API endpoints from config
API_1_URL = config.API_1_URL
API_2_TEMPLATE = config.API_2_TEMPLATE

def create_schema_and_table_if_not_exists(cursor):
    logger.info("Creating schema and table if they don't exist...")
    
    # Create the basic_schema if it doesn't exist
    cursor.execute("CREATE SCHEMA IF NOT EXISTS basic_schema;")
    logger.info("Schema creation statement executed")
    
    # Create the table in basic_schema
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS basic_schema.mutual_funds_details (
            no SERIAL PRIMARY KEY,
            fund_id VARCHAR UNIQUE,
            search_id VARCHAR,
            fund_title VARCHAR,
            fund_expiry VARCHAR,
            entity_type VARCHAR,
            holdings_data JSON
        );
    """)
    logger.info("Table creation statement executed")

def periodic_progress_logger(stop_event, processed_count, updated_count, total_count):
    """Log progress every 10 seconds"""
    while not stop_event.is_set():
        logger.info(f"PROGRESS UPDATE: {processed_count.value}/{total_count} funds processed, {updated_count.value} updated")
        time.sleep(10)  # Log every 10 seconds

def fetch_and_update(limit=None):
    logger.info("=== STARTING MUTUAL FUNDS UPDATE JOB ===")
    start_time = time.time()

    try:
        logger.info("Fetching mutual funds data from API...")
        response = requests.get(API_1_URL)
        response.raise_for_status()
        data = response.json()
        logger.info(f"API response received successfully")

        # Get all funds if limit is None, otherwise get the specified number
        funds = data.get("data", {}).get("content", [])
        if limit is not None:
            funds = funds[:limit]
            logger.info(f"Limited to {limit} funds for processing")
        else:
            logger.info(f"Processing all {len(funds)} funds")
            
        if not funds:
            logger.warning("No data fetched from API 1.")
            return

        # Create thread-safe counters
        class Counter:
            def __init__(self, initial=0):
                self.value = initial
                self._lock = threading.Lock()
            
            def increment(self):
                with self._lock:
                    self.value += 1
                    return self.value

        processed_count = Counter(0)
        updated_count = Counter(0)
        
        # Set up periodic progress logger
        stop_event = threading.Event()
        progress_thread = threading.Thread(
            target=periodic_progress_logger,
            args=(stop_event, processed_count, updated_count, len(funds))
        )
        progress_thread.daemon = True
        progress_thread.start()

        search_ids = []
        
        # Get DB configuration
        DB_CONFIG = get_db_config()
        
        logger.info(f"Establishing database connection to {DB_CONFIG['host']}:{DB_CONFIG['port']}")
        with psycopg2.connect(**DB_CONFIG) as conn:
            conn.autocommit = True
            logger.info("Database connection established successfully")
            
            with conn.cursor() as cur:
                create_schema_and_table_if_not_exists(cur)
                
                for fund in funds:
                    fund_id = fund.get("id")
                    search_id = fund.get("searchId")
                    fund_title = fund.get("title")
                    fund_expiry = fund.get("expiry")
                    entity_type = fund.get("entityType")
                    
                    if not search_id:
                        logger.warning(f"Skipping fund with no search_id: {fund_title}")
                        continue
                        
                    search_ids.append(search_id)
                    
                    # Fetch holdings from API 2
                    holdings_data = None
                    try:
                        logger.debug(f"Fetching holdings for {search_id} ({fund_title})")
                        holdings_response = requests.get(API_2_TEMPLATE.format(search_id=search_id))
                        if holdings_response.ok:
                            holdings_json = holdings_response.json()
                            if isinstance(holdings_json.get("holdings"), list):
                                holdings_data = {"holdings": holdings_json["holdings"]}
                                logger.debug(f"Retrieved {len(holdings_json['holdings'])} holdings for {fund_title}")
                            else:
                                logger.warning(f"No holdings list found for {fund_title}")
                        else:
                            logger.warning(f"Failed to fetch holdings for {fund_title}: HTTP {holdings_response.status_code}")
                    except Exception as e:
                        logger.error(f"Error fetching holdings for {search_id}: {e}")
                        # Continue with the next fund even if this one fails
                    
                    # Insert or update the fund in the database
                    try:
                        cur.execute("""
                            INSERT INTO basic_schema.mutual_funds_details 
                            (fund_id, search_id, fund_title, fund_expiry, entity_type, holdings_data)
                            VALUES (%s, %s, %s, %s, %s, %s)
                            ON CONFLICT (fund_id) 
                            DO UPDATE SET 
                                search_id = EXCLUDED.search_id,
                                fund_title = EXCLUDED.fund_title,
                                fund_expiry = EXCLUDED.fund_expiry,
                                entity_type = EXCLUDED.entity_type,
                                holdings_data = EXCLUDED.holdings_data
                        """, (fund_id, search_id, fund_title, fund_expiry, entity_type, Json(holdings_data) if holdings_data else None))
                    except Exception as e:
                        logger.error(f"Error inserting/updating fund {fund_id}: {e}")
                        continue

                    processed_count.increment()
                    
                    if cur.rowcount > 0:
                        updated_count.increment()
                        logger.debug(f"Updated fund: {fund_title}")
                        
                    # Print progress every 10 funds
                    if processed_count.value % 10 == 0:
                        progress_msg = f"Progress: {processed_count.value}/{len(funds)} funds processed ({updated_count.value} updated)"
                        logger.info(progress_msg)
                        print(progress_msg)

        # Stop the progress logger thread
        stop_event.set()
        if progress_thread.is_alive():
            progress_thread.join(timeout=1)

        end_time = time.time()
        duration = round(end_time - start_time, 2)
        
        logger.info(f"✅ Updated {updated_count.value}/{len(funds)} mutual fund records in basic_schema.")
        logger.info(f"⏱️ Execution time: {duration} seconds")
        logger.info(f"Total search IDs processed: {len(search_ids)}")
        logger.info("=== MUTUAL FUNDS UPDATE JOB COMPLETED SUCCESSFULLY ===")

        print(f"✅ Updated {updated_count.value}/{len(funds)} mutual fund records in basic_schema.")
        print(f"⏱️ Execution time: {duration} seconds")
        print(f"Total search IDs processed: {len(search_ids)}")

    except Exception as e:
        logger.error(f"❌ Error in fetch_and_update: {e}", exc_info=True)
        print(f"❌ Error: {e}")
        logger.info("=== MUTUAL FUNDS UPDATE JOB FAILED ===")

if __name__ == "__main__":
    # If run directly, can specify a limit as a command-line argument
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else None
    fetch_and_update(limit)