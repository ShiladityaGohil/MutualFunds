import sys
import requests
import psycopg2
from psycopg2.extras import Json
import time
import logging
import threading
import os

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

# Database configuration
DB_CONFIG = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "postgres",
    "host": "localhost",
    "port": 5432
}

# API endpoints
API_1_URL = "https://groww.in/v1/api/search/v3/query/global/st_p_query?entity_type=Scheme&page=0&size=10000"
API_2_TEMPLATE = "https://groww.in/v1/api/data/mf/web/v4/scheme/search/{search_id}"

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

        logger.info(f"Establishing database connection to {DB_CONFIG['host']}:{DB_CONFIG['port']}")
        with psycopg2.connect(**DB_CONFIG) as conn:
            conn.autocommit = True
            logger.info("Database connection established successfully")
            
            with conn.cursor() as cur:
                create_schema_and_table_if_not_exists(cur)

                logger.info(f"Starting to process {len(funds)} funds...")
                for i, item in enumerate(funds):
                    if item.get("entity_type") != "Scheme":
                        continue

                    fund_id = item.get("id")
                    search_id = item.get("search_id")
                    fund_title = item.get("title")
                    fund_expiry = item.get("expiry")
                    entity_type = item.get("entity_type")

                    if not (fund_id and search_id and fund_title):
                        logger.warning(f"Skipping fund with incomplete data: {fund_id}")
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

                    # Upsert into DB - updated to use basic_schema
                    logger.debug(f"Upserting fund data for {fund_title}")
                    cur.execute("""
                        INSERT INTO basic_schema.mutual_funds_details (fund_id, search_id, fund_title, fund_expiry, entity_type, holdings_data)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ON CONFLICT (fund_id)
                        DO UPDATE SET
                            search_id = EXCLUDED.search_id,
                            fund_title = EXCLUDED.fund_title,
                            fund_expiry = EXCLUDED.fund_expiry,
                            entity_type = EXCLUDED.entity_type,
                            holdings_data = EXCLUDED.holdings_data
                        WHERE basic_schema.mutual_funds_details.holdings_data::text IS DISTINCT FROM EXCLUDED.holdings_data::text;
                    """, (
                        fund_id, search_id, fund_title, fund_expiry, entity_type, Json(holdings_data)
                    ))

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