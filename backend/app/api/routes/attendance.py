from datetime import date, datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, status

from app.core.serializers import serialize_attendance
from app.db.mongo import get_db
from app.schemas import AttendanceCreate, AttendanceRead


router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.post(
    "",
    response_model=AttendanceRead,
    status_code=status.HTTP_201_CREATED,
)
async def mark_attendance(payload: AttendanceCreate) -> AttendanceRead:
    db = get_db()

    employee = await db.employees.find_one({"employee_id": payload.employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )

    existing = await db.attendance.find_one(
        {
            "employee_id": payload.employee_id,
            "date": datetime.combine(payload.date, datetime.min.time()),
        }
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attendance for this date already exists for the employee.",
        )

    doc = payload.model_dump()
    doc["date"] = datetime.combine(payload.date, datetime.min.time())

    result = await db.attendance.insert_one(doc)
    created = await db.attendance.find_one({"_id": result.inserted_id})
    assert created is not None
    return serialize_attendance(created)


@router.get(
    "/by-employee/{employee_id}",
    response_model=List[AttendanceRead],
)
async def get_employee_attendance(
    employee_id: str,
    start_date: Optional[date] = Query(default=None),
    end_date: Optional[date] = Query(default=None),
) -> List[AttendanceRead]:
    db = get_db()

    employee = await db.employees.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )

    query: dict = {"employee_id": employee_id}

    if start_date or end_date:
        date_filter: dict = {}
        if start_date:
            date_filter["$gte"] = datetime.combine(start_date, datetime.min.time())
        if end_date:
            date_filter["$lte"] = datetime.combine(end_date, datetime.min.time())
        query["date"] = date_filter

    cursor = db.attendance.find(query).sort("date", 1)
    docs = await cursor.to_list(length=None)
    return [serialize_attendance(doc) for doc in docs]

