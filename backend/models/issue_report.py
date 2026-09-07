from extensions import db

class IssueReport(db.Model):
    __tablename__ = "issue_reports"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    issue_id = db.Column(
        db.Integer,
        db.ForeignKey("issues.id"),
        nullable=False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    report_text = db.Column(
        db.Text,
        nullable=False
    )