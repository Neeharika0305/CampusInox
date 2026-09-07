from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from extensions import db
from models.issue import Issue


master_issue_bp = Blueprint(
    "master_issue",
    __name__,
    url_prefix="/api/issues"
)


# ============================================================
# 6.5 JOIN ISSUE TO MASTER ISSUE
# ============================================================

@master_issue_bp.route(
    "/<int:issue_id>/join/<int:master_issue_id>",
    methods=["POST"]
)
@jwt_required()
def join_master_issue(issue_id, master_issue_id):

    try:

        # ==========================================
        # FIND NEW ISSUE
        # ==========================================

        issue = Issue.query.get(issue_id)

        if not issue:
            return jsonify({
                "error": "Issue not found"
            }), 404

        # ==========================================
        # FIND MASTER ISSUE
        # ==========================================

        master_issue = Issue.query.get(
            master_issue_id
        )

        if not master_issue:
            return jsonify({
                "error": "Master issue not found"
            }), 404

        # ==========================================
        # PREVENT SELF JOIN
        # ==========================================

        if issue.id == master_issue.id:
            return jsonify({
                "error": "An issue cannot join itself"
            }), 400

        # ==========================================
        # MASTER MUST ACTUALLY BE MASTER
        # ==========================================

        if not master_issue.is_master:
            return jsonify({
                "error": "Selected issue is not a master issue"
            }), 400

        # ==========================================
        # LINK ISSUE TO MASTER
        # ==========================================

        issue.is_master = False
        issue.master_issue_id = master_issue.id

        db.session.commit()

        # ==========================================
        # GET AGGREGATED DATA
        # ==========================================

        reports = Issue.query.filter(
            db.or_(
                Issue.id == master_issue.id,
                Issue.master_issue_id == master_issue.id
            )
        ).all()

        report_count = len(reports)

        affected_students = len(
            set(
                report.reported_by
                for report in reports
                if report.reported_by is not None
            )
        )

        return jsonify({

            "message":
                "Issue successfully joined to master issue",

            "issue_id":
                issue.id,

            "master_issue_id":
                master_issue.id,

            "master_title":
                master_issue.title,

            "is_master":
                False,

            "report_count":
                report_count,

            "affected_students":
                affected_students

        }), 200

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# 6.6 MASTER ISSUE AGGREGATION
# ============================================================

@master_issue_bp.route(
    "/master/<int:master_issue_id>",
    methods=["GET"]
)
@jwt_required()
def get_master_issue(master_issue_id):

    try:

        # ==========================================
        # FIND MASTER ISSUE
        # ==========================================

        master_issue = Issue.query.get(
            master_issue_id
        )

        if not master_issue:
            return jsonify({
                "error": "Master issue not found"
            }), 404

        # ==========================================
        # VERIFY MASTER
        # ==========================================

        if not master_issue.is_master:
            return jsonify({
                "error": "This issue is not a master issue"
            }), 400

        # ==========================================
        # GET ALL RELATED REPORTS
        # ==========================================

        reports = Issue.query.filter(
            db.or_(
                Issue.id == master_issue.id,
                Issue.master_issue_id == master_issue.id
            )
        ).all()

        # ==========================================
        # REPORT COUNT
        # ==========================================

        report_count = len(reports)

        # ==========================================
        # AFFECTED STUDENTS
        # ==========================================

        affected_students = len(
            set(
                report.reported_by
                for report in reports
                if report.reported_by is not None
            )
        )

        # ==========================================
        # PRIORITY
        # ==========================================

        severity_priority = {
            "LOW": 1,
            "MEDIUM": 2,
            "HIGH": 3,
            "CRITICAL": 4
        }

        highest_severity = "LOW"
        highest_priority_value = 0

        for report in reports:

            severity = (
                report.severity or "LOW"
            ).upper()

            priority_value = severity_priority.get(
                severity,
                1
            )

            if priority_value > highest_priority_value:

                highest_priority_value = priority_value
                highest_severity = severity

        # ==========================================
        # STATUS
        # ==========================================

        status_priority = {
            "REPORTED": 1,
            "ASSIGNED": 2,
            "IN_PROGRESS": 3,
            "RESOLVED": 4
        }

        current_status = master_issue.status

        highest_status_value = status_priority.get(
            current_status,
            1
        )

        for report in reports:

            report_status = report.status

            status_value = status_priority.get(
                report_status,
                1
            )

            if status_value > highest_status_value:

                highest_status_value = status_value
                current_status = report_status

        # ==========================================
        # DEPARTMENT
        # ==========================================

        department_id = master_issue.department_id

        # ==========================================
        # RETURN MASTER ISSUE
        # ==========================================

        return jsonify({

            "master_issue": {

                "id":
                    master_issue.id,

                "issue_code":
                    f"CI-{master_issue.id:04d}",

                "title":
                    master_issue.title,

                "description":
                    master_issue.description,

                "category":
                    master_issue.category,

                "location":
                    master_issue.location,

                "department_id":
                    department_id,

                "priority":
                    highest_severity,

                "status":
                    current_status,

                "is_master":
                    master_issue.is_master

            },

            "aggregation": {

                "report_count":
                    report_count,

                "affected_students":
                    affected_students,

                "priority":
                    highest_severity,

                "department_id":
                    department_id,

                "status":
                    current_status

            },

            "reports": [

                {
                    "id":
                        report.id,

                    "issue_code":
                        f"CI-{report.id:04d}",

                    "title":
                        report.title,

                    "description":
                        report.description,

                    "category":
                        report.category,

                    "location":
                        report.location,

                    "severity":
                        report.severity,

                    "status":
                        report.status,

                    "reported_by":
                        report.reported_by,

                    "master_issue_id":
                        report.master_issue_id,

                    "duplicate_similarity":
                        report.duplicate_similarity

                }

                for report in reports

            ]

        }), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500