import os
import sys
from flask import Flask
from dotenv import load_dotenv

# Add backend directory to sys.path so 'src' module can be imported
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Database configuration
    db_path = os.environ.get("DB_PATH", os.path.join(BACKEND_DIR, "data", "app.db"))
    # Ensure data directory exists
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.abspath(db_path)}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize database
    from src.db import db
    db.init_app(app)
    
    # Create tables
    with app.app_context():
        db.create_all()

    # Register API blueprint
    from src.controllers.routes import bp as api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    @app.route("/", methods=["GET"])
    def home():
        return {"status": "ok", "message": "Lotto dorm assignment backend"}

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5001)))
