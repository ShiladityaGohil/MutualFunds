from flask_apscheduler import APScheduler
from app import create_app
from cron import update_funds

app = create_app()

class Config:
    SCHEDULER_API_ENABLED = True

app.config.from_object(Config())

scheduler = APScheduler()

@scheduler.task('interval', id='update_funds_job', days=1)
def scheduled_task():
    print("Running update_funds...")
    update_funds.fetch_and_update(limit=None)

scheduler.init_app(app)
scheduler.start()

if __name__ == '__main__':
    app.run(debug=True, port=9000)