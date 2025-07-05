from fastapi import Request, HTTPException
from app.core.settings import settings

SECRET_TOKEN = settings.API_TOKEN


def check_token(request: Request):
    token = request.headers.get("Authorization")
    if token != f"Bearer {SECRET_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")
