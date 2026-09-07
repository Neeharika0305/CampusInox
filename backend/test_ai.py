from ai.issue_analyzer import analyze_issue


description = """
The internet has completely stopped working
in Block B hostel. Many students are unable
to attend their online classes.
"""


result = analyze_issue(description)


print("\n🤖 AI ANALYSIS")
print("==========================")

for key, value in result.items():
    print(f"{key}: {value}")