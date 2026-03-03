import SummaryCards from "@/components/dashboard/SummaryCards";
import { Card } from "@/components/ui";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <SummaryCards />
      <Card>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-base font-semibold tracking-tight">
              Welcome back, Admin
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              High-level snapshot of your organisation today.
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Use the sidebar to jump into the employees or attendance views.
          </p>
        </div>
      </Card>
    </div>
  );
}

