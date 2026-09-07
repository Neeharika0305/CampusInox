from extensions import db


class Issue(db.Model):
    __tablename__ = "issues"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(200),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    category = db.Column(
        db.String(100)
    )

    location = db.Column(
        db.String(150)
    )

    severity = db.Column(
        db.String(30)
    )

    image = db.Column(
        db.String(255)
    )

    status = db.Column(
        db.String(30),
        default="REPORTED"
    )

    reported_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    department_id = db.Column(
        db.Integer,
        db.ForeignKey("departments.id")
    )

    assigned_to = db.Column(
        db.Integer,
        db.ForeignKey("users.id")
    )

    # ==========================================
    # DAY 6 - MASTER / DUPLICATE ISSUE
    # ==========================================

    # True  -> This issue is a master issue
    # False -> This issue has joined another issue
    is_master = db.Column(
        db.Boolean,
        default=True,
        nullable=False
    )

    # If this issue is a duplicate, this points
    # to the master issue's ID.
    #
    # Example:
    #
    # CI-0042 -> master_issue_id = NULL
    # CI-0057 -> master_issue_id = 42
    # CI-0061 -> master_issue_id = 42
    #
    master_issue_id = db.Column(
        db.Integer,
        db.ForeignKey("issues.id"),
        nullable=True
    )

    # Stores the semantic similarity score when
    # this issue is identified as a possible duplicate.
    #
    # Example:
    # 0.91 = 91% similarity
    #
    duplicate_similarity = db.Column(
        db.Float,
        nullable=True
    )

    # Relationship:
    # One master issue can have many duplicate issues.
    master_issue = db.relationship(
        "Issue",
        remote_side=[id],
        backref=db.backref(
            "duplicate_issues",
            lazy=True
        )
    )