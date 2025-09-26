from fastapi import FastAPI
from .openaicalls import test_openai_api

from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

@app.get("/")
def root():
    print("Root endpoint accessed")
    return {"message": "Hello World"}

@app.get("/ping")
def ping():
    print("Ping endpoint accessed")
    msg = test_openai_api()
    return {"message": msg}