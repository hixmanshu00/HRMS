# HRMS Lite – Next.js + FastAPI + MongoDB

A lightweight Human Resource Management System (HRMS Lite) built with **Next.js**, **FastAPI**, and **MongoDB**.  
The app lets an admin manage **employees** and track **daily attendance** with a clean, modern UI.

---

## Features

- **Employee management**
  - Add employee with ID, name, email, department
  - List all employees in a sortable-style table
  - Delete employee (and their attendance records)
  - Server-side validation (required fields, email format, duplicate handling)

- **Attendance management**
  - Mark attendance (date + Present/Absent) for an employee
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
      main.py        # FastAPI app, routes, DB access
      schemas.py     # Pydantic models (employees, attendance)
    requirements.txt # Python dependencies

  frontend/
    app/
      layout.tsx     # Root layout
      page.tsx       # Dashboard entry point
      globals.css    # Global styles + Tailwind
    components/
      DashboardPage.tsx # Main dashboard UI
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
- `GET /employees/{employee_id}/attendance` – employee attendance (optional `start_date`, `end_date` query params)
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
2. The top of the dashboard shows:
   - Total employees
   - Present today
   - Absent today
3. Use the **Employees** tab:
   - Right column: add new employees (ID, name, email, department).
   - Left column: view the employee directory, including total present days, and delete employees if needed.
4. Switch to the **Attendance** tab:
   - Right column: mark attendance (select employee, choose date, pick Present/Absent).
   - Left column: select an employee and optionally a date range to see their attendance records.
5. The UI shows loading states, empty states, and error messages (e.g., duplicate employee, invalid attendance).

---

## Validations & Error Handling

- **Employee creation**
  - All fields are required.
  - Email must be a valid email address.
  - Employee ID and email are enforced as unique on the server (400 error if duplicate).

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

## Next Steps / Possible Enhancements

- Authentication & role-based access control.
- Pagination and search for large employee lists.
- More detailed attendance analytics and reports.
- Inline editing for employees and attendance records.
- Docker-based setup for repeatable local/dev environments.

