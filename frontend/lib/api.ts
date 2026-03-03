export type Employee = {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  total_present_days: number;
};

export type Attendance = {
  id: string;
  employee_id: string;
  date: string;
  status: "Present" | "Absent";
};

export type DashboardSummary = {
  total_employees: number;
  present_today: number;
  absent_today: number;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const data = await res.json();
      const detail = data?.detail ?? data;

      if (typeof detail === "string") {
        message = detail;
      } else if (Array.isArray(detail) && detail.length > 0) {
        // FastAPI / Pydantic validation errors come as a list of error objects.
        const first = detail[0];
        if (first?.msg) {
          message = first.msg as string;
        } else {
          message = JSON.stringify(detail);
        }
      } else if (typeof detail === "object" && detail !== null && detail.message) {
        message = String(detail.message);
      } else {
        message = JSON.stringify(detail);
      }
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function fetchEmployees(): Promise<Employee[]> {
  const res = await fetch(`${API_BASE_URL}/employees`, {
    cache: "no-store",
  });
  return handleResponse<Employee[]>(res);
}

export async function createEmployee(payload: {
  full_name: string;
  email: string;
  department: string;
}): Promise<Employee> {
  const res = await fetch(`${API_BASE_URL}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Employee>(res);
}

export async function deleteEmployee(employeeId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/employees/${encodeURIComponent(employeeId)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    await handleResponse(res);
  }
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE_URL}/dashboard/summary`, {
    cache: "no-store",
  });
  return handleResponse<DashboardSummary>(res);
}

export async function createAttendance(payload: {
  employee_id: string;
  date: string;
  status: "Present" | "Absent";
}): Promise<Attendance> {
  const res = await fetch(`${API_BASE_URL}/attendance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Attendance>(res);
}

export async function fetchEmployeeAttendance(
  employeeId: string,
  options?: { start_date?: string; end_date?: string }
): Promise<Attendance[]> {
  const params = new URLSearchParams();
  if (options?.start_date) params.append("start_date", options.start_date);
  if (options?.end_date) params.append("end_date", options.end_date);

  const qs = params.toString();
  const url = `${API_BASE_URL}/attendance/by-employee/${encodeURIComponent(
    employeeId
  )}${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, { cache: "no-store" });
  return handleResponse<Attendance[]>(res);
}

