from datetime import date
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class AttendanceStatus(str, Enum):
    PRESENT = "Present"
    ABSENT = "Absent"


class EmployeeBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    department: str = Field(..., min_length=1, max_length=100)


class EmployeeCreate(EmployeeBase):
    """
    Payload for creating an employee.
    The public API no longer accepts employee_id; it is generated server-side.
    """


class EmployeeRead(EmployeeBase):
    id: str
    employee_id: str
    total_present_days: int = 0


class AttendanceBase(BaseModel):
    employee_id: str
    date: date
    status: AttendanceStatus


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceRead(AttendanceBase):
    id: str

