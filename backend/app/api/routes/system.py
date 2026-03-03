from fastapi import APIRouter

from app.db.mongo import get_db


router = APIRouter(tags=["system"])


@router.get("/health")
async def health_check():
    db = get_db()
    await db.command("ping")
    return {"status": "ok"}

