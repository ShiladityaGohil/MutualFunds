# Mutual Funds API Backend

This is the backend API for the Mutual Funds comparison application.

## Local Development

### Prerequisites
- Python 3.8+
- PostgreSQL

### Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file with your configuration:
   ```
   # Database Configuration
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432

   # API Configuration
   API_1_URL=https://groww.in/v1/api/search/v3/query/global/st_p_query?entity_type=Scheme&page=0&size=10000
   API_2_TEMPLATE=https://groww.in/v1/api/data/mf/web/v4/scheme/search/{search_id}

   # Flask Configuration
   FLASK_ENV=development
   FLASK_DEBUG=True
   PORT=9000
   ```

4. Run the application:
   ```
   python run.py
   ```

## Deployment on Render

### Manual Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - Environment: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn run:app`
4. Add the following environment variables:
   - `FLASK_ENV`: production
   - `FLASK_DEBUG`: false
   - `API_1_URL`: https://groww.in/v1/api/search/v3/query/global/st_p_query?entity_type=Scheme&page=0&size=10000
   - `API_2_TEMPLATE`: https://groww.in/v1/api/data/mf/web/v4/scheme/search/{search_id}
   - `DATABASE_URL`: (Create a PostgreSQL database on Render and link it)

### Using render.yaml

If you have the `render.yaml` file in your repository, you can use Render Blueprints:

1. Push your code to GitHub
2. Go to the Render Dashboard
3. Click "New" and select "Blueprint"
4. Connect your repository
5. Render will automatically set up the services defined in `render.yaml`

## API Endpoints

- `GET /api/v1/mutual-funds/search?title={query}` - Search for mutual funds by title
- `GET /api/v1/mutual-funds/{search_id}/holdings` - Get holdings for a specific fund
- `GET /api/v1/mutual-funds/compare-holdings?fund1={id1}&fund2={id2}` - Compare holdings between two funds

## Scheduled Tasks

The application includes a scheduled task that runs daily to update mutual fund data.