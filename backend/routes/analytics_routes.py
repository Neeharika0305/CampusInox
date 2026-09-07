from flask import Blueprint, jsonify

analytics_bp = Blueprint("analytics", __name__, url_prefix="/api/analytics")


@analytics_bp.route("/summary", methods=["GET"])
def summary():
    return jsonify({
        "issues": 128,
        "pending": 24,
        "resolved": 91,
        "critical": 13
    })


@analytics_bp.route("/categories", methods=["GET"])
def categories():
    return jsonify([
        {"category": "Network", "count": 32},
        {"category": "Hostel", "count": 28},
        {"category": "Electricity", "count": 24},
        {"category": "Classroom", "count": 25},
        {"category": "Transport", "count": 19}
    ])


@analytics_bp.route("/locations", methods=["GET"])
def locations():
    return jsonify([
        {"location": "Block A", "count": 30},
        {"location": "Block B", "count": 25},
        {"location": "Library", "count": 18},
        {"location": "Labs", "count": 31},
        {"location": "Hostel", "count": 24}
    ])


@analytics_bp.route("/resolution", methods=["GET"])
def resolution():
    return jsonify({
        "average_resolution_time": 18.5,
        "resolution_rate": 71.1,
        "pending_issues": 24
    })