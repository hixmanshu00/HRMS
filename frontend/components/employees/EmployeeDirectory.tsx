"use client";

import { useEffect, useState } from "react";

import {
  Employee,
  createAttendance,
  createEmployee,
  deleteEmployee,
  fetchEmployees,
} from "@/lib/api";
import { Button, Card, Input } from "../ui";

const initialEmployeeForm = {
  full_name: "",
  email: "",
  department: "",
};

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);

  const [employeeForm, setEmployeeForm] = useState(initialEmployeeForm);
  const [employeeFormLoading, setEmployeeFormLoading] = useState(false);
  const [employeeFormError, setEmployeeFormError] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const loadEmployees = async () => {
    setEmployeesLoading(true);
    setEmployeesError(null);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err: any) {
      setEmployeesError(err.message ?? "Failed to load employees.");
    } finally {
      setEmployeesLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleEmployeeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setEmployeeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmployeeFormError(null);

    if (!employeeForm.full_name || !employeeForm.email || !employeeForm.department) {
      setEmployeeFormError("Please fill in all required fields.");
      return;
    }

    setEmployeeFormLoading(true);
    try {
      const created = await createEmployee(employeeForm);
      setEmployeeForm(initialEmployeeForm);
      setEmployees((prev) => [created, ...prev]);
      setIsAddOpen(false);
      showToast("success", "Employee added successfully.");
    } catch (err: any) {
      setEmployeeFormError(err.message ?? "Unable to create employee.");
      showToast("error", err.message ?? "Unable to create employee.");
    } finally {
      setEmployeeFormLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    setDeleteLoading(true);
    try {
      await deleteEmployee(employeeId);
      setEmployees((prev) => prev.filter((e) => e.employee_id !== employeeId));
      showToast("success", "Employee deleted.");
    } catch (err: any) {
      showToast("error", err.message ?? "Unable to delete employee.");
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleMarkTodayPresent = async (employeeId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setMarkingId(employeeId);
    try {
      await createAttendance({
        employee_id: employeeId,
        date: today,
        status: "Present",
      });
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.employee_id === employeeId
            ? { ...emp, total_present_days: emp.total_present_days + 1 }
            : emp
        )
      );
      showToast("success", "Marked present for today.");
    } catch (err: any) {
      showToast(
        "error",
        err?.message ?? "Unable to mark attendance for today."
      );
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <>
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">
              Employee directory
            </h2>
            <p className="text-xs text-slate-400">
              View and manage all registered employees.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={loadEmployees}>
              Refresh
            </Button>
            <Button onClick={() => setIsAddOpen(true)}>Add employee</Button>
          </div>
        </div>

        <Card className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-slate-800/80">
            <div className="max-h-[460px] overflow-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-2 font-medium">Employee</th>
                    <th className="px-4 py-2 font-medium">Email</th>
                    <th className="px-4 py-2 font-medium">Department</th>
                    <th className="px-4 py-2 font-medium text-right">
                      Present days
                    </th>
                    <th className="px-4 py-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {employeesLoading && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-sm text-slate-400"
                      >
                        Loading employees…
                      </td>
                    </tr>
                  )}
                  {!employeesLoading && employeesError && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-sm text-rose-400"
                      >
                        {employeesError}
                      </td>
                    </tr>
                  )}
                  {!employeesLoading &&
                    !employeesError &&
                    employees.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-6 text-center text-sm text-slate-400"
                        >
                          No employees yet. Use “Add employee” to create the
                          first record.
                        </td>
                      </tr>
                    )}
                  {!employeesLoading &&
                    !employeesError &&
                    employees.map((emp) => (
                      <tr
                        key={emp.id}
                        className="hover:bg-slate-900/60 transition-colors"
                      >
                        <td className="px-4 py-3 align-middle">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {emp.full_name}
                            </span>
                            <span className="text-xs text-slate-400">
                              {emp.employee_id}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle text-sm">
                          {emp.email}
                        </td>
                        <td className="px-4 py-3 align-middle text-sm">
                          {emp.department}
                        </td>
                        <td className="px-4 py-3 align-middle text-right text-sm">
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300">
                            {emp.total_present_days}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-middle text-right space-x-1">
                          <Button
                            variant="ghost"
                            className="mb-1 text-xs text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-100"
                            loading={markingId === emp.employee_id}
                            onClick={() => handleMarkTodayPresent(emp.employee_id)}
                          >
                            Mark today present
                          </Button>
                          <Button
                            variant="ghost"
                            className="text-xs text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                            onClick={() => setDeleteTarget(emp)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </section>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`flex max-w-xs items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg shadow-slate-950/70 ${
              toast.type === "success"
                ? "border-emerald-500/40 bg-slate-900/95 text-emerald-100"
                : "border-rose-500/40 bg-slate-900/95 text-rose-100"
            }`}
          >
            <span
              className={`mt-0.5 inline-flex h-2 w-2 rounded-full ${
                toast.type === "success" ? "bg-emerald-400" : "bg-rose-400"
              }`}
            />
            <p>{toast.message}</p>
          </div>
        </div>
      )}

      {isAddOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-xl shadow-slate-950/80">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold tracking-tight">
                  Add employee
                </h2>
                <p className="text-xs text-slate-400">
                  Capture the minimum details to add someone to your directory.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="px-2 py-1 text-xs text-slate-400 hover:text-slate-100"
                onClick={() => setIsAddOpen(false)}
              >
                Close
              </Button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3">
              <Input
                label="Full name"
                id="full_name"
                name="full_name"
                value={employeeForm.full_name}
                onChange={handleEmployeeInputChange}
                placeholder="Jane Doe"
                required
              />
              <Input
                label="Email address"
                id="email"
                name="email"
                type="email"
                value={employeeForm.email}
                onChange={handleEmployeeInputChange}
                placeholder="jane.doe@company.com"
                required
              />
              <Input
                label="Department"
                id="department"
                name="department"
                value={employeeForm.department}
                onChange={handleEmployeeInputChange}
                placeholder="Engineering, HR, Finance…"
                required
              />
              {employeeFormError && (
                <p className="text-xs text-rose-400">{employeeFormError}</p>
              )}
              <div className="pt-1">
                <Button
                  type="submit"
                  loading={employeeFormLoading}
                  className="w-full"
                >
                  Save employee
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-xl shadow-slate-950/80">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold tracking-tight">
                  Remove employee
                </h2>
                <p className="text-xs text-slate-400">
                  This will also remove all of their attendance records.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="px-2 py-1 text-xs text-slate-400 hover:text-slate-100"
                onClick={() => setDeleteTarget(null)}
              >
                Close
              </Button>
            </div>

            <div className="space-y-3 text-sm text-slate-200">
              <p>
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {deleteTarget.full_name} ({deleteTarget.employee_id})
                </span>
                ?
              </p>
              <p className="text-xs text-slate-400">
                This action cannot be undone.
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2 text-sm">
              <Button
                type="button"
                variant="ghost"
                className="px-3"
                disabled={deleteLoading}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="px-3 text-rose-100"
                loading={deleteLoading}
                onClick={() => handleDeleteEmployee(deleteTarget.employee_id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

