from fastapi import FastAPI, File, UploadFile, HTTPException
from typing import List
import os
import shutil
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


@app.post("/upload-single")
async def upload_single_file(file: UploadFile = File(...)):
    """
    Upload a single file (image, audio, etc.)
    """
    # Validate file type (optional)
    allowed_types = ["image/jpeg", "image/png", "image/webp", "audio/mpeg", "audio/m4a"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail=f"File type {file.content_type} not allowed")
    
    # Create uploads directory if it doesn't exist
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save the file
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {
        "message": "File uploaded successfully",
        "filename": file.filename,
        "content_type": file.content_type,
        "size": file.size,
        "file_path": file_path
    }


@app.post("/upload-multiple")
async def upload_multiple_files(files: List[UploadFile] = File(...)):
    """
    Upload multiple files at once
    """
    if len(files) > 10:  # Limit number of files
        raise HTTPException(status_code=400, detail="Too many files. Maximum 10 allowed.")
    
    uploaded_files = []
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    for file in files:
        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/webp", "audio/mpeg", "audio/m4a", "audio/mp4"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail=f"File type {file.content_type} not allowed")
        
        # Save the file
        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        uploaded_files.append({
            "filename": file.filename,
            "content_type": file.content_type,
            "size": file.size,
            "file_path": file_path
        })
    
    return {
        "message": f"Successfully uploaded {len(uploaded_files)} files",
        "files": uploaded_files
    }


@app.post("/analyze-ingredients")
async def analyze_ingredients(files: List[UploadFile] = File(...)):
    """
    Upload ingredient images and get cooking suggestions
    """
    if len(files) > 5:  # Limit to 5 ingredient images
        raise HTTPException(status_code=400, detail="Too many files. Maximum 5 ingredient images allowed.")
    
    # Validate that all files are images
    for file in files:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail=f"Only image files allowed. Got: {file.content_type}")
    
    uploaded_files = []
    upload_dir = "temp_uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    try:
        # Save uploaded files temporarily
        for file in files:
            file_path = os.path.join(upload_dir, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            uploaded_files.append(file_path)
        
        # TODO: Integrate with OpenAI to analyze the uploaded images
        # For now, return a placeholder response
        return {
            "message": "Images uploaded successfully",
            "analysis": "AI analysis would go here - integration with OpenAI vision model needed",
            "uploaded_files": [os.path.basename(f) for f in uploaded_files],
            "suggestions": "Based on your ingredients, you could make a delicious stir-fry!"
        }
    
    except Exception as e:
        # Clean up files in case of error
        for file_path in uploaded_files:
            if os.path.exists(file_path):
                os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing files: {str(e)}")
    
    finally:
        # Clean up temporary files
        for file_path in uploaded_files:
            if os.path.exists(file_path):
                os.remove(file_path)

