import os
import sys
from flask import Flask
from flask_cors import CORS

# Add backend directory to sys.path so 'src' module can be imported
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for all routes - allow all origins and all methods
    CORS(app, resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": False
        }
    })
    
    # Load configuration from settings
    from src.config.settings import settings
    settings.ensure_data_dir()
    
    app.config['SQLALCHEMY_DATABASE_URI'] = settings.SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = settings.SQLALCHEMY_TRACK_MODIFICATIONS
    
    # Initialize database
    from src.config.database import db
    db.init_app(app)
    
    # Import models so they're registered with SQLAlchemy
    from src.models import Student, Assignment, RealtimeStudent, RealtimeAssignment
    
    # Create tables
    with app.app_context():
        db.create_all()

    # Register API blueprints
    from src.controllers.routes import register_blueprints
    register_blueprints(app)

    @app.route("/", methods=["GET"])
    def home():
        return {"status": "ok", "message": "Lotto dorm assignment backend"}

    return app

app = create_app()

if __name__ == "__main__":
    from src.config.settings import settings
    app.run(host=settings.HOST, port=settings.PORT, debug=settings.DEBUG)
