from typing import List

from fastapi import APIRouter, HTTPException, status
from pymongo import ReturnDocument

from app.core.serializers import serialize_employee
from app.db.mongo import get_db
from app.schemas import EmployeeCreate, EmployeeRead


router = APIRouter(prefix="/employees", tags=["employees"])


@router.post(
    "",
    response_model=EmployeeRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_employee(payload: EmployeeCreate) -> EmployeeRead:
    """
    Create a new employee.

    - Employee IDs are generated sequentially server-side starting from 101.
    - Email is validated as unique to avoid duplicates.
    """
    db = get_db()

    existing_email = await db.employees.find_one({"email": payload.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee with this email already exists.",
        )

    counter = await db.counters.find_one_and_update(
        {"_id": "employee_id"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    # Start external IDs from 101 by offsetting the internal counter.
    employee_id = str(counter.get("seq", 1) + 100)

    doc = {
        "employee_id": employee_id,
        **payload.model_dump(),
    }

    result = await db.employees.insert_one(doc)
    created = await db.employees.find_one({"_id": result.inserted_id})
    assert created is not None
    return serialize_employee(created, total_present_days=0)


@router.get("", response_model=List[EmployeeRead])
async def list_employees() -> List[EmployeeRead]:
    db = get_db()

    employees_cursor = db.employees.find({})
    employees: list[dict] = await employees_cursor.to_list(length=None)

    pipeline = [
        {
            "$match": {
                "status": "Present",
            }
        },
        {
            "$group": {
                "_id": "$employee_id",
                "present_days": {"$sum": 1},
            }
        },
    ]
    present_counts_cursor = db.attendance.aggregate(pipeline)
    present_counts_raw = await present_counts_cursor.to_list(length=None)
    present_map = {doc["_id"]: doc["present_days"] for doc in present_counts_raw}

    return [
        serialize_employee(emp, total_present_days=present_map.get(emp["employee_id"], 0))
        for emp in employees
    ]


@router.delete(
    "/{employee_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_employee(employee_id: str) -> None:
    db = get_db()

    result = await db.employees.delete_one({"employee_id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )

    await db.attendance.delete_many({"employee_id": employee_id})

