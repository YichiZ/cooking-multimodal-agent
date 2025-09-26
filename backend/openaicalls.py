from openai import OpenAI
import os
import base64
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

    # Path to your image
    image_path1 = os.path.join(script_dir, "assets", "img1.webp")
    image_path2 = os.path.join(script_dir, "assets", "img2.webp")
    audio_path = os.path.join(script_dir, "assets", "you-are-a-cook-voice.m4a")

    # Getting the Base64 string
    base64_image1 = encode_image(image_path1)
    base64_image2 = encode_image(image_path2)
    # TODO: create a class and make the client a member variable.
    audio_text = speech_to_text(audio_path, client)

    response = client.responses.create(
        model="gpt-5-mini-2025-08-07",
        input=[
            {
                "role": "user",
                "content": [
                    { "type": "input_text", "text": audio_text},
                    {
                        "type": "input_image",
                        "image_url": f"data:image/webp;base64,{base64_image1}",
                    },
                    {
                        "type": "input_image",
                        "image_url": f"data:image/webp;base64,{base64_image2}",
                    },
                ],
            }
        ],
    )

    return response.output_text

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
    
def speech_to_text(audio_path, client):
    with open(audio_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            model="gpt-4o-transcribe", 
            file=audio_file
        )
        print("Transcription result:", transcription.text)
        return transcription.text