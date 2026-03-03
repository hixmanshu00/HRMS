# HRMS Lite – Next.js + FastAPI + MongoDB

A lightweight Human Resource Management System (HRMS Lite) built with **Next.js**, **FastAPI**, and **MongoDB**.  
The app lets an admin manage **employees** and track **daily attendance** with a clean, modern UI.

---

## Features

- **Employee management**
  - Add employee with full name, email, department
  - Employee IDs are generated sequentially on the server starting from `101`
  - List all employees in a sortable-style table
  - Delete employee (and their attendance records)
  - Server-side validation (required fields, email format, duplicate handling)

- **Attendance management**
  - Mark attendance (date + Present/Absent) for an employee
  - Quick “Mark today present” action directly from the employee directory
  - View attendance records per employee
  - Optional date range filter (from / to)

- **Dashboard summary (bonus)**
  - Total employees
  - Present today
  - Absent today
  - Per-employee total present days

- **UX & UI**
  - Modern dashboard-style layout using Tailwind CSS
  - Clear loading, empty, and error states
  - Toast feedback for key actions

---

## Tech Stack

- **Frontend**
  - Next.js 14 (App Router, TypeScript)
  - React 18
  - Tailwind CSS

- **Backend**
  - FastAPI
  - Motor (async MongoDB driver)
  - Pydantic v2

- **Database**
  - MongoDB

---

## Project Structure

```text
hrmss/
  backend/
    app/
      main.py          # FastAPI app factory, router wiring, error handlers
      schemas.py       # Pydantic models (employees, attendance)
      core/
        config.py      # Settings and .env loading
        serializers.py # Mongo → API model serializers
      db/
        mongo.py       # MongoDB client and db helpers
      api/
        routes/
          system.py    # /health
          employees.py # /employees CRUD
          attendance.py# /attendance, /attendance/by-employee/{employee_id}
          dashboard.py # /dashboard/summary
    requirements.txt # Python dependencies

  frontend/
    app/
      layout.tsx       # Root layout (AppShell + sidebar)
      page.tsx         # Redirects to /dashboard
      dashboard/
        page.tsx       # Dashboard summary view
      employees/
        page.tsx       # Employees directory view
      attendance/
        page.tsx       # Attendance view
      globals.css      # Global styles + Tailwind
    components/
      layout/AppShell.tsx      # Shared shell with sidebar + header
      dashboard/SummaryCards.tsx # Dashboard KPI cards
      employees/EmployeeDirectory.tsx # Employee table + add/delete UI
      attendance/AttendanceView.tsx   # Attendance log + mark form
      ui.tsx            # Reusable UI primitives (Button, Input, Card, etc.)
    lib/
      api.ts        # Frontend API client wrappers
    package.json
    tsconfig.json
    next.config.mjs

  .env.example       # Example environment variables
  README.md          # This file
```

---

## Getting Started Locally

### 1. Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB running locally or in the cloud

Clone or copy this project into a folder named `hrmss`, then:

```bash
cd hrmss
```

---

### 2. Configure environment variables

Copy the example environment file and adjust as needed:

```bash
cp .env.example .env
```

Edit `.env` to point to your MongoDB instance:

```env
MONGO_URL=mongodb://localhost:27017
MONGO_DB_NAME=hrms_lite

NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

> **Note**: The backend reads `MONGO_URL` and `MONGO_DB_NAME`.  
> The frontend uses `NEXT_PUBLIC_API_BASE_URL` to talk to the FastAPI server.

---

### 3. Run the backend (FastAPI)

Open a terminal in the `backend` folder:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.

Useful endpoints:

- `GET /health` – health check
- `GET /employees` – list employees
- `POST /employees` – create employee
- `DELETE /employees/{employee_id}` – delete employee
- `POST /attendance` – mark attendance
- `GET /attendance/by-employee/{employee_id}` – employee attendance (optional `start_date`, `end_date` query params)
- `GET /dashboard/summary` – dashboard counts

---

### 4. Run the frontend (Next.js)

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

Make sure the backend (`http://localhost:8000`) is running and matches the value of `NEXT_PUBLIC_API_BASE_URL` in your `.env`.

---

## How to Use the App

1. **Open** `http://localhost:3000` in your browser.
2. The **Dashboard** page shows:
   - Total employees
   - Present today
   - Absent today
3. Use the **sidebar navigation**:
   - **Dashboard**: high-level metrics only.
   - **Employees**: full-width employee table with total present days and actions.
   - **Attendance**: attendance log and mark-attendance form.
4. On the **Employees** page:
   - Click **Add employee** to open a modal, enter name/email/department, and save.
   - Use **Remove** to delete an employee (a confirmation dialog appears) and cascade-delete their attendance.
   - Use **Mark today present** in the table to quickly mark today as Present; the “Present days” pill updates immediately.
5. On the **Attendance** page:
   - Choose an employee and optional date range to see their attendance history.
   - Use the form on the right to mark attendance for any date as Present/Absent.
6. The UI shows loading states, empty states, and clear error messages (e.g., invalid email, duplicate employee, duplicate attendance).

---

## Validations & Error Handling

- **Employee creation**
  - All fields are required.
  - Email must be a valid email address.
  - Email is enforced as unique on the server (400 error if duplicate).
  - Employee ID is generated server-side and guaranteed to be unique.

- **Attendance**
  - Employee must exist; otherwise a 404 is returned.
  - Only one attendance record per employee per date (400 error on duplicate).

- **HTTP semantics**
  - `201 Created` for successful creates.
  - `204 No Content` for deletes.
  - `400 Bad Request` for validation issues.
  - `404 Not Found` for missing employees.

Errors are surfaced in the UI as inline error messages and/or toast notifications.

---

## Assumptions & Limitations

- Single admin user; **no authentication**.
- No pagination – lists are assumed to be small for this assignment.
- No advanced HR features (leave, payroll, roles, etc.).
- Attendance counts are computed per employee, not pre-aggregated for large datasets.
- CORS is configured permissively (allowing all origins) for simplicity in local/dev usage.

---

