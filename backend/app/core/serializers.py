from datetime import datetime
from typing import Any, Dict

from bson import ObjectId

from app.schemas import AttendanceRead, EmployeeRead


def serialize_id(raw_id: ObjectId | str) -> str:
    if isinstance(raw_id, ObjectId):
        return str(raw_id)
    return raw_id


def serialize_employee(doc: Dict[str, Any], total_present_days: int = 0) -> EmployeeRead:
    return EmployeeRead(
        id=serialize_id(doc["_id"]),
        employee_id=doc["employee_id"],
        full_name=doc["full_name"],
        email=doc["email"],
        department=doc["department"],
        total_present_days=total_present_days,
    )


def serialize_attendance(doc: Dict[str, Any]) -> AttendanceRead:
    return AttendanceRead(
        id=serialize_id(doc["_id"]),
        employee_id=doc["employee_id"],
        date=doc["date"].date() if isinstance(doc["date"], datetime) else doc["date"],
        status=doc["status"],
    )

