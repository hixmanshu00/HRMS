from datetime import datetime, timezone

from fastapi import APIRouter

from app.db.mongo import get_db


router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary")
async def dashboard_summary():
    db = get_db()

    total_employees = await db.employees.count_documents({})

    # Use UTC calendar date so it lines up with the date
    # sent from the frontend (new Date().toISOString().slice(0, 10)).
    utc_today = datetime.now(timezone.utc).date()
    today = datetime.combine(utc_today, datetime.min.time())

    present_today = await db.attendance.count_documents(
        {"date": today, "status": "Present"}
    )
    absent_today = await db.attendance.count_documents(
        {"date": today, "status": "Absent"}
    )

    return {
        "total_employees": total_employees,
        "present_today": present_today,
        "absent_today": absent_today,
    }

