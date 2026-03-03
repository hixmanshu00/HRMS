"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Attendance,
  Employee,
  createAttendance,
  fetchEmployeeAttendance,
  fetchEmployees,
} from "@/lib/api";
import { Badge, Button, Card, Input, Select } from "../ui";

export default function AttendanceView() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);

  const [selectedEmployeeForAttendance, setSelectedEmployeeForAttendance] =
    useState("");
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);
  const [attendanceFilter, setAttendanceFilter] = useState({
    start_date: "",
    end_date: "",
  });

  const [attendanceForm, setAttendanceForm] = useState({
    employee_id: "",
    date: new Date().toISOString().slice(0, 10),
    status: "Present" as "Present" | "Absent",
  });
  const [attendanceFormLoading, setAttendanceFormLoading] = useState(false);
  const [attendanceFormError, setAttendanceFormError] =
    useState<string | null>(null);

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const loadEmployees = async () => {
      setEmployeesLoading(true);
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch {
        // surface only in attendance errors if needed
      } finally {
        setEmployeesLoading(false);
      }
    };
    loadEmployees();
  }, []);

  useEffect(() => {
    if (!selectedEmployeeForAttendance) {
      setAttendance([]);
      return;
    }
    const loadAttendance = async () => {
      setAttendanceLoading(true);
      setAttendanceError(null);
      try {
        const data = await fetchEmployeeAttendance(selectedEmployeeForAttendance, {
          start_date: attendanceFilter.start_date || undefined,
          end_date: attendanceFilter.end_date || undefined,
        });
        setAttendance(data);
      } catch (err: any) {
        setAttendanceError(err.message ?? "Failed to load attendance.");
      } finally {
        setAttendanceLoading(false);
      }
    };
    loadAttendance();
  }, [
    selectedEmployeeForAttendance,
    attendanceFilter.start_date,
    attendanceFilter.end_date,
  ]);

  const handleAttendanceInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setAttendanceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttendanceFormError(null);

    if (!attendanceForm.employee_id) {
      setAttendanceFormError("Please choose an employee.");
      return;
    }

    setAttendanceFormLoading(true);
    try {
      const created = await createAttendance(attendanceForm);
      if (created.employee_id === selectedEmployeeForAttendance) {
        setAttendance((prev) => [...prev, created]);
      }
      showToast("success", "Attendance saved.");
    } catch (err: any) {
      setAttendanceFormError(err.message ?? "Unable to mark attendance.");
      showToast("error", err.message ?? "Unable to mark attendance.");
    } finally {
      setAttendanceFormLoading(false);
    }
  };

  const currentEmployeeName = useMemo(() => {
    const employee = employees.find(
      (e) => e.employee_id === selectedEmployeeForAttendance
    );
    return employee ? employee.full_name : "";
  }, [employees, selectedEmployeeForAttendance]);

  return (
    <>
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Card className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">
              Attendance log
            </h2>
            <p className="text-xs text-slate-400">
              Filter and review attendance history per employee.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Select
              label="Employee"
              value={selectedEmployeeForAttendance}
              onChange={(e) =>
                setSelectedEmployeeForAttendance(e.target.value)
              }
            >
              <option value="">Select employee…</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </Select>
            <Input
              label="From date"
              type="date"
              name="start_date"
              value={attendanceFilter.start_date}
              onChange={(e) =>
                setAttendanceFilter((prev) => ({
                  ...prev,
                  start_date: e.target.value,
                }))
              }
            />
            <Input
              label="To date"
              type="date"
              name="end_date"
              value={attendanceFilter.end_date}
              onChange={(e) =>
                setAttendanceFilter((prev) => ({
                  ...prev,
                  end_date: e.target.value,
                }))
              }
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <p>
              {currentEmployeeName
                ? `Showing records for ${currentEmployeeName}.`
                : "Select an employee to view their attendance."}
            </p>
          </div>

          <div className="mt-3 overflow-hidden rounded-xl border border-slate-800/80">
            <div className="max-h-[360px] overflow-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {attendanceLoading && (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-4 py-6 text-center text-sm text-slate-400"
                      >
                        Loading attendance…
                      </td>
                    </tr>
                  )}
                  {!attendanceLoading && attendanceError && (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-4 py-6 text-center text-sm text-rose-400"
                      >
                        {attendanceError}
                      </td>
                    </tr>
                  )}
                  {!attendanceLoading &&
                    !attendanceError &&
                    selectedEmployeeForAttendance &&
                    attendance.length === 0 && (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-6 text-center text-sm text-slate-400"
                        >
                          No attendance records for this employee in the
                          selected range.
                        </td>
                      </tr>
                    )}
                  {!attendanceLoading &&
                    !attendanceError &&
                    !selectedEmployeeForAttendance && (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-6 text-center text-sm text-slate-400"
                        >
                          Choose an employee to load their attendance history.
                        </td>
                      </tr>
                    )}
                  {!attendanceLoading &&
                    !attendanceError &&
                    attendance.map((record) => (
                      <tr key={record.id}>
                        <td className="px-4 py-3 text-sm">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge
                            variant={
                              record.status === "Present"
                                ? "success"
                                : "danger"
                            }
                          >
                            {record.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">
              Mark attendance
            </h2>
            <p className="text-xs text-slate-400">
              Record who is present or absent on a given day.
            </p>
          </div>

          <form onSubmit={handleCreateAttendance} className="space-y-3">
            <Select
              label="Employee"
              name="employee_id"
              value={attendanceForm.employee_id}
              onChange={handleAttendanceInputChange}
              required
            >
              <option value="">Select employee…</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </Select>
            <Input
              label="Date"
              type="date"
              name="date"
              value={attendanceForm.date}
              onChange={handleAttendanceInputChange}
              required
            />
            <Select
              label="Status"
              name="status"
              value={attendanceForm.status}
              onChange={handleAttendanceInputChange}
              required
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </Select>
            {attendanceFormError && (
              <p className="text-xs text-rose-400">{attendanceFormError}</p>
            )}
            <div className="pt-1">
              <Button
                type="submit"
                loading={attendanceFormLoading}
                className="w-full"
              >
                Save attendance
              </Button>
            </div>
          </form>
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
    </>
  );
}

