import json
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

from ai.prompts import SYSTEM_PROMPT

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def analyze_issue(description):

    response = client.models.generate_content(
        model="gemini-3.7-flash",

        contents=description,

        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            temperature=0.2
        )
    )

    return json.loads(response.text)