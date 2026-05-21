from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from app.services import storage_service
from app.dependencies import current_user_dependency

router = APIRouter()

@router.post("/upload")
async def upload_file(current_user: current_user_dependency, file: UploadFile = File(...)):
    filename = await storage_service.save_file(file)
    return JSONResponse(content={"url": f"http://localhost:8000/uploaded_files/{filename}"})
