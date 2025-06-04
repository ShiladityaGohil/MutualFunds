import os
from flask_apscheduler import APScheduler
from app import create_app
from cron import update_funds
import config

app = create_app()

class Config:
    SCHEDULER_API_ENABLED = True

app.config.from_object(Config())

scheduler = APScheduler()

@scheduler.task('cron', id='update_funds_job', hour=17, minute=50)
def scheduled_task():
    print("Running update_funds...")
    update_funds.fetch_and_update(limit=None)

scheduler.init_app(app)
scheduler.start()

if __name__ == '__main__':
    port = config.PORT
    debug = config.DEBUG
    app.run(debug=debug, port=port, host='0.0.0.0')