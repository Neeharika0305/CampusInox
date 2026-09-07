from routes.analytics_routes import analytics_bp
from routes.ai_routes import ai_bp
from routes.duplicate_routes import duplicate_bp
from routes.master_issue_routes import master_issue_bp

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from extensions import db


def create_app():

    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # Initialize database
    db.init_app(app)

    # Initialize JWT
    JWTManager(app)

    # Enable CORS for React frontend
    CORS(app)

    # Register models
    from models import (
        User,
        Department,
        Issue,
        IssueReport,
        IssueTimeline
    )

    # ==============================
    # Register Authentication Routes
    # ==============================

    from routes.auth import auth_bp

    app.register_blueprint(
        auth_bp,
        url_prefix="/api"
    )

    # ==============================
    # Register Issue Routes
    # ==============================

    from routes.issue import issue_bp

    app.register_blueprint(issue_bp)

    # ==============================
    # Register Admin Routes
    # ==============================

    from routes.admin import admin_bp

    app.register_blueprint(admin_bp)

    # ==============================
    # Register AI Routes
    # ==============================

    app.register_blueprint(ai_bp)
    app.register_blueprint(duplicate_bp)

    # ==============================
    # Register Master Issue Routes
    # ==============================

    app.register_blueprint(master_issue_bp)

    # ==============================
    # Register Analytics Routes
    # ==============================

    app.register_blueprint(analytics_bp)

    # ==============================
    # Create Database Tables
    # ==============================

    with app.app_context():
        db.create_all()

    # ==============================
    # Health Check
    # ==============================

    @app.route("/api/health", methods=["GET"])
    def health():

        try:

            with db.engine.connect() as connection:
                connection.execute(db.text("SELECT 1"))

            return jsonify({
                "status": "success",
                "message": "CampusInox API + MySQL are connected"
            })

        except Exception as e:

            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    return app


# Create Flask application

app = create_app()


# Run server

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )