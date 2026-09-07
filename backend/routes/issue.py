from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

import os
import uuid

from extensions import db
from models.issue import Issue


issue_bp = Blueprint("issue", __name__)


# =========================================================
# IMAGE UPLOAD CONFIGURATION
# =========================================================

UPLOAD_FOLDER = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "uploads"
)

ALLOWED_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp"
}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


# =========================================================
# 1. CREATE ISSUE
# =========================================================

@issue_bp.route("/api/issues", methods=["POST"])
@jwt_required()
def create_issue():

    title = request.form.get("title")
    description = request.form.get("description")
    category = request.form.get("category")
    location = request.form.get("location")
    severity = request.form.get("severity")

    # =====================================================
    # DAY 6.5 - MASTER ISSUE DATA
    # =====================================================

    master_issue_id = request.form.get(
        "master_issue_id"
    )

    duplicate_similarity = request.form.get(
        "duplicate_similarity"
    )

    # Validate required fields
    if (
        not title
        or not description
        or not category
        or not location
    ):
        return jsonify({
            "message": (
                "Title, description, category "
                "and location are required"
            )
        }), 400

    user_id = int(get_jwt_identity())

    # =====================================================
    # DAY 6.5 - VALIDATE MASTER ISSUE
    # =====================================================

    master_issue = None

    if master_issue_id:

        try:
            master_issue_id = int(
                master_issue_id
            )

        except ValueError:

            return jsonify({
                "message": "Invalid master issue ID"
            }), 400

        master_issue = Issue.query.get(
            master_issue_id
        )

        if not master_issue:

            return jsonify({
                "message": "Master issue not found"
            }), 404

        # The selected issue must actually
        # be a master issue.
        if not master_issue.is_master:

            return jsonify({
                "message": (
                    "Selected issue is not "
                    "a master issue"
                )
            }), 400

        # Validate similarity if supplied.
        if duplicate_similarity:

            try:

                duplicate_similarity = float(
                    duplicate_similarity
                )

            except ValueError:

                return jsonify({
                    "message": (
                        "Invalid duplicate similarity"
                    )
                }), 400

            if not 0 <= duplicate_similarity <= 1:

                return jsonify({
                    "message": (
                        "Duplicate similarity must "
                        "be between 0 and 1"
                    )
                }), 400

    else:

        # New issue becomes a master issue
        master_issue_id = None
        duplicate_similarity = None

    # =====================================================
    # HANDLE IMAGE
    # =====================================================

    image = request.files.get("image")

    image_filename = None

    if image and image.filename:

        if not allowed_file(image.filename):

            return jsonify({
                "message": (
                    "Invalid image format. "
                    "Allowed: PNG, JPG, JPEG, GIF, WEBP"
                )
            }), 400

        original_filename = secure_filename(
            image.filename
        )

        unique_filename = (
            str(uuid.uuid4())
            + "_"
            + original_filename
        )

        image_path = os.path.join(
            UPLOAD_FOLDER,
            unique_filename
        )

        image.save(image_path)

        image_filename = unique_filename

    # =====================================================
    # CREATE ISSUE
    # =====================================================

    issue = Issue(
        title=title.strip(),
        description=description.strip(),
        category=category,
        location=location.strip(),
        severity=severity,
        image=image_filename,
        status="REPORTED",
        reported_by=user_id,

        # =================================================
        # DAY 6.5
        # =================================================

        is_master=(
            master_issue_id is None
        ),

        master_issue_id=master_issue_id,

        duplicate_similarity=(
            duplicate_similarity
        )
    )

    db.session.add(issue)
    db.session.commit()

    # =====================================================
    # RESPONSE
    # =====================================================

    response_data = {
        "message": (
            "Issue reported successfully"
        ),
        "issue_id": issue.id,
        "image": image_filename,
        "is_master": issue.is_master,
        "master_issue_id": issue.master_issue_id,
        "duplicate_similarity": (
            issue.duplicate_similarity
        )
    }

    if master_issue:

        response_data["message"] = (
            "Issue successfully joined "
            "to existing master issue"
        )

        response_data["master_issue"] = {
            "id": master_issue.id,
            "title": master_issue.title
        }

    return jsonify(response_data), 201


# =========================================================
# 2. GET MY ISSUES
# =========================================================

@issue_bp.route("/api/issues/my", methods=["GET"])
@jwt_required()
def get_my_issues():

    user_id = int(get_jwt_identity())

    issues = Issue.query.filter_by(
        reported_by=user_id
    ).order_by(
        Issue.id.desc()
    ).all()

    result = []

    for issue in issues:

        image_url = None

        if issue.image:

            image_url = (
                f"/api/issues/images/{issue.image}"
            )

        result.append({

            "id": issue.id,

            "title": issue.title,

            "description": issue.description,

            "category": issue.category,

            "location": issue.location,

            "severity": issue.severity,

            "status": issue.status,

            "image": issue.image,

            "image_url": image_url,

            # =================================================
            # DAY 6
            # =================================================

            "is_master": issue.is_master,

            "master_issue_id":
                issue.master_issue_id,

            "duplicate_similarity":
                issue.duplicate_similarity

        })

    return jsonify(result), 200


# =========================================================
# 3. GET ISSUE BY ID
# =========================================================

@issue_bp.route(
    "/api/issues/<int:issue_id>",
    methods=["GET"]
)
@jwt_required()
def get_issue(issue_id):

    user_id = int(get_jwt_identity())

    issue = Issue.query.get(issue_id)

    if not issue:

        return jsonify({
            "message": "Issue not found"
        }), 404

    # Student can only view their own issue
    if issue.reported_by != user_id:

        return jsonify({
            "message": (
                "You are not authorized "
                "to view this issue"
            )
        }), 403

    image_url = None

    if issue.image:

        image_url = (
            f"/api/issues/images/{issue.image}"
        )

    return jsonify({

        "id": issue.id,

        "title": issue.title,

        "description": issue.description,

        "category": issue.category,

        "location": issue.location,

        "severity": issue.severity,

        "status": issue.status,

        "reported_by": issue.reported_by,

        "image": issue.image,

        "image_url": image_url,

        # =================================================
        # DAY 6
        # =================================================

        "is_master": issue.is_master,

        "master_issue_id":
            issue.master_issue_id,

        "duplicate_similarity":
            issue.duplicate_similarity

    }), 200


# =========================================================
# 4. SERVE ISSUE IMAGE
# =========================================================

@issue_bp.route(
    "/api/issues/images/<filename>",
    methods=["GET"]
)
def get_issue_image(filename):

    return send_from_directory(
        UPLOAD_FOLDER,
        filename
    )


# =========================================================
# 5. ISSUE STATUS COUNTS
# =========================================================

@issue_bp.route(
    "/api/issues/status",
    methods=["GET"]
)
@jwt_required()
def get_issue_status():

    user_id = int(get_jwt_identity())

    issues = Issue.query.filter_by(
        reported_by=user_id
    ).all()

    reported = 0
    in_progress = 0
    resolved = 0

    for issue in issues:

        if issue.status == "REPORTED":
            reported += 1

        elif issue.status == "IN_PROGRESS":
            in_progress += 1

        elif issue.status == "RESOLVED":
            resolved += 1

    return jsonify({

        "reported": reported,

        "in_progress": in_progress,

        "resolved": resolved,

        "total": len(issues)

    }), 200