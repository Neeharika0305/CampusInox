from sqlalchemy import text

from app import app
from extensions import db


with app.app_context():

    print("Updating CampusInox database...")

    with db.engine.begin() as connection:

        # Add is_master column
        try:
            connection.execute(
                text("""
                    ALTER TABLE issues
                    ADD COLUMN is_master BOOLEAN NOT NULL DEFAULT TRUE
                """)
            )
            print("✓ is_master column added")

        except Exception as e:
            if "Duplicate column" in str(e):
                print("✓ is_master column already exists")
            else:
                raise

        # Add master_issue_id column
        try:
            connection.execute(
                text("""
                    ALTER TABLE issues
                    ADD COLUMN master_issue_id INT NULL
                """)
            )
            print("✓ master_issue_id column added")

        except Exception as e:
            if "Duplicate column" in str(e):
                print("✓ master_issue_id column already exists")
            else:
                raise

        # Add duplicate_similarity column
        try:
            connection.execute(
                text("""
                    ALTER TABLE issues
                    ADD COLUMN duplicate_similarity FLOAT NULL
                """)
            )
            print("✓ duplicate_similarity column added")

        except Exception as e:
            if "Duplicate column" in str(e):
                print("✓ duplicate_similarity column already exists")
            else:
                raise

        # Add self-referencing foreign key
        try:
            connection.execute(
                text("""
                    ALTER TABLE issues
                    ADD CONSTRAINT fk_issues_master_issue
                    FOREIGN KEY (master_issue_id)
                    REFERENCES issues(id)
                """)
            )
            print("✓ Master issue foreign key added")

        except Exception as e:
            if (
                "Duplicate foreign key constraint name" in str(e)
                or "already exists" in str(e)
            ):
                print("✓ Master issue foreign key already exists")
            else:
                raise

    print()
    print("===================================")
    print("DAY 6 DATABASE UPDATE COMPLETE")
    print("===================================")