"""
Main routes file - registers all blueprints
"""
from flask import Blueprint

# Import blueprints from separate route files
from src.controllers.lottery.lottery_routes import lottery_bp
from src.controllers.realtime.realtime_routes import realtime_bp

# This is just for backward compatibility if needed
bp = Blueprint("api", __name__)


def register_blueprints(app):
    """Register all API blueprints with the app"""
    app.register_blueprint(lottery_bp, url_prefix="/api/preData")
    app.register_blueprint(realtime_bp, url_prefix="/api/realtime")
