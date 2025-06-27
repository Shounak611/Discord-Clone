from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
import os
import uuid

router = APIRouter()

UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Safe filename and extension handling
    original_name = file.filename or "unnamed.bin"
    ext = os.path.splitext(original_name)[-1] or ".bin"
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Write file
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Return public URL
    return JSONResponse(content={"url": f"http://localhost:8000/uploaded_files/{filename}"})
