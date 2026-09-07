from flask import Blueprint, request, jsonify

from ai.issue_analyzer import analyze_issue


ai_bp = Blueprint(
    "ai",
    __name__,
    url_prefix="/api/ai"
)


@ai_bp.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json()

    description = data.get("description")

    if not description:
        return jsonify({
            "error": "Issue description is required"
        }), 400

    try:

        result = analyze_issue(description)

        return jsonify(result), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500