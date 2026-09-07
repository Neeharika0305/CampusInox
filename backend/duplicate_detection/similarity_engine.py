from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


# Load the semantic similarity model once.
# This model runs locally and does not require a paid API.
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


def calculate_similarity(new_description, existing_description):
    """
    Calculate semantic similarity between two issue descriptions.

    Returns:
        float: similarity score between 0 and 1
    """

    if not new_description or not existing_description:
        return 0.0

    embeddings = model.encode(
        [
            new_description,
            existing_description
        ]
    )

    similarity = cosine_similarity(
        [embeddings[0]],
        [embeddings[1]]
    )[0][0]

    return float(similarity)


def find_similarity(new_description, existing_issues, threshold=0.75):
    """
    Compare a new issue against existing issues.

    Args:
        new_description: Description of the newly submitted issue.
        existing_issues: List of existing Issue objects.
        threshold: Minimum similarity required to consider
                   an issue a possible duplicate.

    Returns:
        List of possible duplicate issues.
    """

    possible_duplicates = []

    if not new_description:
        return possible_duplicates

    for issue in existing_issues:

        similarity = calculate_similarity(
            new_description,
            issue.description
        )

        if similarity >= threshold:

            possible_duplicates.append(
                {
                    "issue_id": issue.id,
                    "title": issue.title,
                    "description": issue.description,
                    "similarity": round(similarity, 4)
                }
            )

    # Highest similarity first
    possible_duplicates.sort(
        key=lambda x: x["similarity"],
        reverse=True
    )

    return possible_duplicates