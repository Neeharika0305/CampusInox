from models.issue import Issue

from duplicate_detection.similarity_engine import find_similarity


SIMILARITY_THRESHOLD = 0.75


def find_possible_duplicates(description):
    """
    Find existing master issues that are semantically
    similar to the new issue description.
    """

    # Get only master issues.
    master_issues = Issue.query.filter_by(
        is_master=True
    ).all()

    # Compare the new description against
    # existing master issue descriptions.
    possible_duplicates = find_similarity(
        description,
        master_issues,
        threshold=SIMILARITY_THRESHOLD
    )

    return possible_duplicates