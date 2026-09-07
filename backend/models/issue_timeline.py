from extensions import db
from datetime import datetime


class IssueTimeline(db.Model):
    __tablename__ = "issue_timeline"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    issue_id = db.Column(
        db.Integer,
        db.ForeignKey("issues.id"),
        nullable=False
    )

    status = db.Column(
        db.String(30),
        nullable=False
    )

    comment = db.Column(
        db.Text
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )