from flask import Blueprint, request, jsonify

from duplicate_detection.duplicate_checker import (
    find_possible_duplicates
)


duplicate_bp = Blueprint(
    "duplicate",
    __name__,
    url_prefix="/api/ai"
)


@duplicate_bp.route("/check-duplicate", methods=["POST"])
def check_duplicate():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    description = data.get("description")

    if not description or not description.strip():
        return jsonify({
            "error": "Issue description is required"
        }), 400

    try:

        possible_duplicates = find_possible_duplicates(
            description.strip()
        )

        return jsonify({
            "is_duplicate": len(possible_duplicates) > 0,
            "possible_duplicates": possible_duplicates
        }), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500