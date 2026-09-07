from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from extensions import db
from models.issue import Issue


admin_bp = Blueprint("admin", __name__)


# =========================================================
# ADMIN AUTHORIZATION
# =========================================================

def admin_required():

    claims = get_jwt()

    if claims.get("role") != "ADMIN":
        return jsonify({
            "message": "Admin access required"
        }), 403

    return None


# =========================================================
# GET ALL CAMPUS ISSUES
# =========================================================

@admin_bp.route(
    "/api/admin/issues",
    methods=["GET"]
)
@jwt_required()
def get_all_issues():

    # Check ADMIN role
    authorization_error = admin_required()

    if authorization_error:
        return authorization_error

    issues = Issue.query.order_by(
        Issue.id.desc()
    ).all()

    result = []

    for issue in issues:

        result.append({
            "id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "category": issue.category,
            "location": issue.location,
            "severity": issue.severity,
            "status": issue.status,
            "reported_by": issue.reported_by,
            "image": issue.image,
            "department_id": issue.department_id,
            "assigned_to": issue.assigned_to
        })

    return jsonify(result), 200


# =========================================================
# UPDATE ISSUE STATUS
# =========================================================

@admin_bp.route(
    "/api/admin/issues/<int:issue_id>/status",
    methods=["PUT"]
)
@jwt_required()
def update_issue_status(issue_id):

    # Check ADMIN role
    authorization_error = admin_required()

    if authorization_error:
        return authorization_error

    # Get issue
    issue = Issue.query.get(issue_id)

    if not issue:
        return jsonify({
            "message": "Issue not found"
        }), 404

    # Get JSON data
    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request body must contain JSON"
        }), 400

    new_status = data.get("status")

    # Allowed statuses
    allowed_statuses = {
        "REPORTED",
        "ASSIGNED",
        "IN_PROGRESS",
        "RESOLVED"
    }

    if new_status not in allowed_statuses:
        return jsonify({
            "message": "Invalid status",
            "allowed_statuses": list(allowed_statuses)
        }), 400

    # Update status
    issue.status = new_status

    db.session.commit()

    return jsonify({
        "message": "Issue status updated successfully",
        "issue_id": issue.id,
        "status": issue.status
    }), 200


# =========================================================
# ASSIGN DEPARTMENT
# =========================================================

@admin_bp.route(
    "/api/admin/issues/<int:issue_id>/assign-department",
    methods=["PUT"]
)
@jwt_required()
def assign_department(issue_id):

    authorization_error = admin_required()

    if authorization_error:
        return authorization_error

    issue = Issue.query.get(issue_id)

    if not issue:
        return jsonify({
            "message": "Issue not found"
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request body must contain JSON"
        }), 400

    department_id = data.get("department_id")

    if not department_id:
        return jsonify({
            "message": "department_id is required"
        }), 400

    from models.department import Department

    department = Department.query.get(department_id)

    if not department:
        return jsonify({
            "message": "Department not found"
        }), 404

    issue.department_id = department.id

    if issue.status == "REPORTED":
        issue.status = "ASSIGNED"

    db.session.commit()

    return jsonify({
        "message": "Department assigned successfully",
        "issue_id": issue.id,
        "department_id": department.id,
        "department_name": department.name,
        "status": issue.status
    }), 200


# =========================================================
# ASSIGN STAFF
# =========================================================

@admin_bp.route(
    "/api/admin/issues/<int:issue_id>/assign-staff",
    methods=["PUT"]
)
@jwt_required()
def assign_staff(issue_id):

    authorization_error = admin_required()

    if authorization_error:
        return authorization_error

    issue = Issue.query.get(issue_id)

    if not issue:
        return jsonify({
            "message": "Issue not found"
        }), 404

    data = request.get_json() or {}

    staff_id = data.get("staff_id")

    if not staff_id:
        return jsonify({
            "message": "staff_id is required"
        }), 400

    from models.user import User

    staff = User.query.get(staff_id)

    if not staff:
        return jsonify({
            "message": "Staff user not found"
        }), 404

    if staff.role != "STAFF":
        return jsonify({
            "message": "User is not a STAFF member"
        }), 400

    issue.assigned_to = staff.id

    if issue.status == "REPORTED":
        issue.status = "ASSIGNED"

    db.session.commit()

    return jsonify({
        "message": "Staff assigned successfully",
        "issue_id": issue.id,
        "staff_id": staff.id,
        "staff_name": staff.name,
        "status": issue.status
    }), 200


# =========================================================
# ADD COMMENT
# =========================================================

@admin_bp.route(
    "/api/admin/issues/<int:issue_id>/comment",
    methods=["POST"]
)
@jwt_required()
def add_comment(issue_id):

    authorization_error = admin_required()

    if authorization_error:
        return authorization_error

    # Get issue
    issue = Issue.query.get(issue_id)

    if not issue:
        return jsonify({
            "message": "Issue not found"
        }), 404

    # Get JSON data
    data = request.get_json() or {}

    comment = data.get("comment")

    # Validate comment
    if not comment or not comment.strip():
        return jsonify({
            "message": "Comment is required"
        }), 400

    # Import timeline model
    from models.issue_timeline import IssueTimeline

    # Create timeline entry
    timeline = IssueTimeline(
        issue_id=issue.id,
        status=issue.status,
        comment=comment.strip()
    )

    db.session.add(timeline)

    db.session.commit()

    return jsonify({
        "message": "Comment added successfully",
        "issue_id": issue.id,
        "status": issue.status,
        "comment": timeline.comment
    }), 201