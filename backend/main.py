from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    print("Root endpoint accessed")
    return {"message": "Hello World"}