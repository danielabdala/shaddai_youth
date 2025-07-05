from fastapi import APIRouter
from app.core.settings import settings


router = APIRouter()


@router.get("/debug/settings")
def debug_settings():
    return {
        "DATABASE_URL": settings.DATABASE_URL,
        "API_TOKEN": settings.API_TOKEN[:4] + "***"  # mask for safety
    }
