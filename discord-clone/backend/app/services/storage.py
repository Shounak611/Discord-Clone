import os
import uuid
from fastapi import UploadFile

class FileStorageService:
    def __init__(self, upload_dir: str = "uploaded_files"):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    async def save_file(self, file: UploadFile) -> str:
        original_name = file.filename or "unnamed.bin"
        ext = os.path.splitext(original_name)[-1] or ".bin"
        filename = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(self.upload_dir, filename)

        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        return filename

storage_service = FileStorageService()
