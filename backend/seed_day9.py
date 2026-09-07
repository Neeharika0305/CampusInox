from app import app
from extensions import db
from models.user import User
from models.issue import Issue
from models.issue_report import IssueReport
from models.issue_timeline import IssueTimeline
from models.department import Department


# ============================================================
# DAY 9 - CAMPUSINOX REALISTIC DEMO DATA
# ============================================================

DEPARTMENTS = [
    ("IT Support", "Network, WiFi and technical infrastructure"),
    ("Electrical", "Electrical and power maintenance"),
    ("Civil Maintenance", "Buildings and infrastructure"),
    ("Hostel Maintenance", "Hostel facilities and maintenance"),
    ("Housekeeping", "Cleaning and sanitation"),
    ("Water Management", "Water supply and plumbing"),
    ("Library Services", "Library facilities and systems"),
]


MASTER_DATA = [
    {
        "title": "WiFi outage in Block A",
        "description": "Students are unable to connect to the campus WiFi in Block A. Network connectivity is unavailable across multiple classrooms.",
        "category": "Network",
        "location": "Block A - 2nd Floor",
        "severity": "CRITICAL",
        "status": "IN_PROGRESS",
        "department": "IT Support",
    },
    {
        "title": "Power failure in Computer Lab",
        "description": "Power supply is frequently failing inside the computer laboratory, interrupting practical sessions.",
        "category": "Electricity",
        "location": "Computer Lab 1",
        "severity": "CRITICAL",
        "status": "REPORTED",
        "department": "Electrical",
    },
    {
        "title": "Water leakage near Hostel Block B",
        "description": "A water pipe is leaking near the entrance of Hostel Block B and creating a slippery area.",
        "category": "Water",
        "location": "Hostel Block B",
        "severity": "HIGH",
        "status": "IN_PROGRESS",
        "department": "Water Management",
    },
    {
        "title": "Broken classroom projector",
        "description": "The projector in the classroom is not displaying content correctly during lectures.",
        "category": "Equipment",
        "location": "Block B - Room 204",
        "severity": "MEDIUM",
        "status": "REPORTED",
        "department": "IT Support",
    },
    {
        "title": "Unclean washroom in Academic Block",
        "description": "The washroom has not been cleaned properly and requires immediate housekeeping attention.",
        "category": "Cleanliness",
        "location": "Academic Block - Ground Floor",
        "severity": "HIGH",
        "status": "RESOLVED",
        "department": "Housekeeping",
    },
    {
        "title": "Damaged classroom window",
        "description": "A classroom window is damaged and the glass frame is loose.",
        "category": "Infrastructure",
        "location": "Block C - Room 101",
        "severity": "MEDIUM",
        "status": "RESOLVED",
        "department": "Civil Maintenance",
    },
    {
        "title": "Hostel room ceiling fan not working",
        "description": "The ceiling fan in the hostel room is not functioning and requires electrical repair.",
        "category": "Electricity",
        "location": "Hostel Block A - Room 212",
        "severity": "HIGH",
        "status": "IN_PROGRESS",
        "department": "Electrical",
    },
    {
        "title": "Library computer not working",
        "description": "One of the public computers in the library is not starting and shows no display.",
        "category": "Equipment",
        "location": "Central Library",
        "severity": "MEDIUM",
        "status": "REPORTED",
        "department": "IT Support",
    },
    {
        "title": "Drinking water dispenser empty",
        "description": "The drinking water dispenser near the student lounge is empty and needs to be refilled.",
        "category": "Water",
        "location": "Student Lounge",
        "severity": "LOW",
        "status": "RESOLVED",
        "department": "Water Management",
    },
    {
        "title": "Classroom lights flickering",
        "description": "Multiple LED lights are flickering continuously inside the classroom.",
        "category": "Electricity",
        "location": "Block B - Room 302",
        "severity": "MEDIUM",
        "status": "IN_PROGRESS",
        "department": "Electrical",
    },
    {
        "title": "Garbage accumulation near hostel",
        "description": "Garbage has accumulated near the hostel entrance and requires cleaning.",
        "category": "Cleanliness",
        "location": "Hostel Block C Entrance",
        "severity": "HIGH",
        "status": "REPORTED",
        "department": "Housekeeping",
    },
    {
        "title": "Cracked corridor floor tiles",
        "description": "Several floor tiles in the academic corridor are cracked and need replacement.",
        "category": "Infrastructure",
        "location": "Block A - Main Corridor",
        "severity": "MEDIUM",
        "status": "RESOLVED",
        "department": "Civil Maintenance",
    },
]


DUPLICATE_TEMPLATES = [
    "Students are facing the same problem with {title_lower}. The problem is still affecting students in this area.",
    "Another student reported {title_lower}. The issue continues during regular campus hours.",
    "Multiple students noticed {title_lower}. Please investigate the problem.",
    "The same campus problem was observed again: {title_lower}.",
]


def get_or_create_departments():
    departments = {}

    for name, description in DEPARTMENTS:
        department = Department.query.filter_by(name=name).first()

        if not department:
            department = Department(
                name=name,
                description=description
            )
            db.session.add(department)
            db.session.flush()

        departments[name] = department.id

    return departments


def cleanup_previous_demo_data():
    demo_issues = Issue.query.filter(
        Issue.title.like("DAY9 DEMO:%")
    ).all()

    if not demo_issues:
        return

    issue_ids = [issue.id for issue in demo_issues]

    IssueReport.query.filter(
        IssueReport.issue_id.in_(issue_ids)
    ).delete(synchronize_session=False)

    IssueTimeline.query.filter(
        IssueTimeline.issue_id.in_(issue_ids)
    ).delete(synchronize_session=False)

    for issue in demo_issues:
        db.session.delete(issue)

    db.session.commit()


def get_users():
    student = User.query.filter_by(
        email="student@test.com"
    ).first()

    admin = User.query.filter_by(
        email="admin@gmail.com"
    ).first()

    staff = User.query.filter_by(
        email="staff@test.com"
    ).first()

    if not student:
        raise Exception("student@test.com not found")

    if not admin:
        raise Exception("admin@gmail.com not found")

    if not staff:
        raise Exception("staff@test.com not found")

    return student, admin, staff


def add_timeline(issue, status, comment):
    timeline = IssueTimeline(
        issue_id=issue.id,
        status=status,
        comment=comment
    )

    db.session.add(timeline)


def create_issue(
    data,
    student_id,
    department_id,
    assigned_to=None,
    master_issue_id=None,
    similarity=None,
    duplicate_index=0
):
    is_master = master_issue_id is None

    title = f"DAY9 DEMO: {data['title']}"

    if not is_master:
        title = (
            f"DAY9 DEMO: Duplicate {duplicate_index} - "
            f"{data['title']}"
        )

    description = data["description"]

    if not is_master:
        description = (
            DUPLICATE_TEMPLATES[
                (duplicate_index - 1) % len(DUPLICATE_TEMPLATES)
            ].format(
                title_lower=data["title"].lower()
            )
        )

    issue = Issue(
        title=title,
        description=description,
        category=data["category"],
        location=data["location"],
        severity=data["severity"],
        status=data["status"],
        reported_by=student_id,
        department_id=department_id,
        assigned_to=assigned_to,
        is_master=is_master,
        master_issue_id=master_issue_id,
        duplicate_similarity=similarity
    )

    db.session.add(issue)
    db.session.flush()

    # Timeline
    add_timeline(
        issue,
        "REPORTED",
        "Issue reported by student."
    )

    if data["status"] in ["ASSIGNED", "IN_PROGRESS"]:
        add_timeline(
            issue,
            "ASSIGNED",
            "Issue assigned to maintenance staff."
        )

    if data["status"] == "IN_PROGRESS":
        add_timeline(
            issue,
            "IN_PROGRESS",
            "Maintenance team is currently working on the issue."
        )

    if data["status"] == "RESOLVED":
        add_timeline(
            issue,
            "IN_PROGRESS",
            "Maintenance team started resolving the issue."
        )

        add_timeline(
            issue,
            "RESOLVED",
            "Issue has been resolved successfully."
        )

    # IssueReport
    report = IssueReport(
        issue_id=issue.id,
        user_id=student_id,
        report_text=description
    )

    db.session.add(report)

    return issue


def main():
    with app.app_context():

        print("\n==========================================")
        print(" CAMPUSINOX - DAY 9 DEMO DATA")
        print("==========================================\n")

        # ----------------------------------------------------
        # Users
        # ----------------------------------------------------

        student, admin, staff = get_users()

        print(f"Student: {student.email}")
        print(f"Admin:   {admin.email}")
        print(f"Staff:   {staff.email}")

        # ----------------------------------------------------
        # Departments
        # ----------------------------------------------------

        departments = get_or_create_departments()

        print(f"\nDepartments ready: {len(departments)}")

        # ----------------------------------------------------
        # Remove previous Day 9 data
        # ----------------------------------------------------

        cleanup_previous_demo_data()

        # ----------------------------------------------------
        # Create 12 MASTER issues
        # ----------------------------------------------------

        masters = []

        for data in MASTER_DATA:

            department_id = departments[data["department"]]

            master = create_issue(
                data=data,
                student_id=student.id,
                department_id=department_id,
                assigned_to=staff.id
            )

            masters.append(master)

        db.session.commit()

        print(f"Master issues created: {len(masters)}")

        # ----------------------------------------------------
        # Create 38 DUPLICATES
        # ----------------------------------------------------

        duplicate_count = 0

        for index in range(38):

            master = masters[index % len(masters)]

            data = MASTER_DATA[index % len(MASTER_DATA)]

            duplicate_count += 1

            severity_cycle = [
                "LOW",
                "MEDIUM",
                "HIGH",
                "CRITICAL"
            ]

            status_cycle = [
                "REPORTED",
                "IN_PROGRESS",
                "RESOLVED",
                "ASSIGNED"
            ]

            duplicate_data = {
                **data,
                "severity": severity_cycle[
                    index % len(severity_cycle)
                ],
                "status": status_cycle[
                    index % len(status_cycle)
                ]
            }

            similarity_values = [
                0.94,
                0.92,
                0.91,
                0.89,
                0.87,
                0.95,
                0.90,
            ]

            similarity = similarity_values[
                index % len(similarity_values)
            ]

            create_issue(
                data=duplicate_data,
                student_id=student.id,
                department_id=departments[
                    data["department"]
                ],
                assigned_to=staff.id,
                master_issue_id=master.id,
                similarity=similarity,
                duplicate_index=duplicate_count
            )

        db.session.commit()

        # ----------------------------------------------------
        # Final statistics
        # ----------------------------------------------------

        total = Issue.query.filter(
            Issue.title.like("DAY9 DEMO:%")
        ).count()

        masters_count = Issue.query.filter(
            Issue.title.like("DAY9 DEMO:%"),
            Issue.is_master == True
        ).count()

        duplicates_count = Issue.query.filter(
            Issue.title.like("DAY9 DEMO:%"),
            Issue.is_master == False
        ).count()

        resolved = Issue.query.filter(
            Issue.title.like("DAY9 DEMO:%"),
            Issue.status == "RESOLVED"
        ).count()

        in_progress = Issue.query.filter(
            Issue.title.like("DAY9 DEMO:%"),
            Issue.status == "IN_PROGRESS"
        ).count()

        reported = Issue.query.filter(
            Issue.title.like("DAY9 DEMO:%"),
            Issue.status == "REPORTED"
        ).count()

        assigned = Issue.query.filter(
            Issue.title.like("DAY9 DEMO:%"),
            Issue.status == "ASSIGNED"
        ).count()

        critical = Issue.query.filter(
            Issue.title.like("DAY9 DEMO:%"),
            Issue.severity == "CRITICAL"
        ).count()

        print("\n==========================================")
        print(" DAY 9 DATA CREATED SUCCESSFULLY")
        print("==========================================")
        print(f"Total Issues      : {total}")
        print(f"Master Issues     : {masters_count}")
        print(f"Duplicate Issues  : {duplicates_count}")
        print(f"Critical          : {critical}")
        print(f"Reported          : {reported}")
        print(f"Assigned          : {assigned}")
        print(f"In Progress       : {in_progress}")
        print(f"Resolved          : {resolved}")
        print("==========================================\n")


if __name__ == "__main__":
    main()