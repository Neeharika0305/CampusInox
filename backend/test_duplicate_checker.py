from app import app

from duplicate_detection.duplicate_checker import (
    find_possible_duplicates
)


with app.app_context():

    print()
    print("===================================")
    print("CAMPUSINOX DUPLICATE DETECTION TEST")
    print("===================================")

    new_issue = """
    The internet has completely stopped working
    in Block B hostel. Many students cannot attend
    online classes.
    """

    print()
    print("New Issue:")
    print(new_issue.strip())

    print()
    print("Searching existing master issues...")

    duplicates = find_possible_duplicates(
        new_issue
    )

    print()

    if not duplicates:

        print("No possible duplicates found.")

    else:

        print(
            f"Found {len(duplicates)} possible duplicate(s):"
        )

        print()

        for duplicate in duplicates:

            similarity = duplicate["similarity"]

            print("-----------------------------------")

            print(
                f"Issue ID: {duplicate['issue_id']}"
            )

            print(
                f"Title: {duplicate['title']}"
            )

            print(
                f"Similarity: {similarity}"
            )

            print(
                f"Percentage: {similarity * 100:.2f}%"
            )

            print("-----------------------------------")

    print()
    print("===================================")