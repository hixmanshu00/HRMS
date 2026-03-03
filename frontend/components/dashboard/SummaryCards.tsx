"use client";

import { useEffect, useState } from "react";

import { DashboardSummary, fetchDashboardSummary } from "@/lib/api";
import { Badge, Card } from "../ui";

export default function SummaryCards() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardSummary();
        setSummary(data);
      } catch {
        // swallow for now, dashboard is best-effort
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-x-0 -top-16 h-24 bg-gradient-to-br from-brand-500/20 via-brand-400/5 to-transparent blur-3xl" />
        <div className="relative flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total employees
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {loading && !summary ? "…" : summary?.total_employees ?? 0}
            </p>
          </div>
          <Badge variant="neutral">Directory</Badge>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Present today
            </p>
            <p className="mt-1 text-2xl font-semibold text-emerald-400">
              {loading && !summary ? "…" : summary?.present_today ?? 0}
            </p>
          </div>
          <Badge variant="success">On-site</Badge>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Absent today
            </p>
            <p className="mt-1 text-2xl font-semibold text-rose-400">
              {loading && !summary ? "…" : summary?.absent_today ?? 0}
            </p>
          </div>
          <Badge variant="danger">Out</Badge>
        </div>
      </Card>
    </section>
  );
}

