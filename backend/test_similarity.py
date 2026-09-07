from duplicate_detection.similarity_engine import calculate_similarity


issue_1 = """
WiFi is not working in Block B hostel.
Students cannot access the internet.
"""


issue_2 = """
Students in Block B hostel have lost
internet connectivity and cannot go online.
"""


issue_3 = """
The water supply in the hostel bathrooms
has stopped completely.
"""


similarity_1 = calculate_similarity(
    issue_1,
    issue_2
)


similarity_2 = calculate_similarity(
    issue_1,
    issue_3
)


print()
print("===================================")
print("CAMPUSINOX SEMANTIC SIMILARITY TEST")
print("===================================")

print()
print("WiFi issue vs WiFi issue:")
print(
    f"Similarity: {similarity_1:.2f}"
)
print(
    f"Percentage: {similarity_1 * 100:.2f}%"
)

print()
print("WiFi issue vs Water issue:")
print(
    f"Similarity: {similarity_2:.2f}"
)
print(
    f"Percentage: {similarity_2 * 100:.2f}%"
)

print()
print("===================================")