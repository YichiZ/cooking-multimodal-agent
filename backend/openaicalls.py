from openai import OpenAI
import os
from dotenv import load_dotenv


def test_openai_api():
    # Get the directory where this script is located and load .env from there
    script_dir = os.path.dirname(os.path.abspath(__file__))
    env_file_path = os.path.join(script_dir, '.env')
    load_dotenv(env_file_path)
    
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        print("ERROR: OPENAI_API_KEY not found in environment variables")
        return
    
    client = OpenAI(
        api_key=api_key
    )

    response = client.responses.create(
        model="gpt-5-mini-2025-08-07",
        input="write a haiku about ai",
        store=True,
    )

    return response.output_text