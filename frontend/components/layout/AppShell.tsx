"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

import { Badge, Button } from "../ui";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/employees", label: "Employees" },
  { href: "/attendance", label: "Attendance" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-950 text-slate-100">
      <aside className="hidden w-60 border-r border-slate-800/80 bg-slate-950/90 px-4 py-5 md:flex md:flex-col md:gap-6">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-900/60">
            <span className="text-sm font-semibold text-white">HR</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">HRMS Lite</p>
            <p className="text-[11px] text-slate-400">Admin console</p>
          </div>
        </div>
        <nav className="space-y-1 text-sm">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${
                  active
                    ? "bg-slate-900 text-slate-50 shadow-sm shadow-slate-900/60"
                    : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-100"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto px-1 text-[11px] text-slate-500">
          <p>Single admin. Demo HR tool.</p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="flex items-center gap-3 md:hidden">
              <Button
                type="button"
                variant="ghost"
                className="h-8 w-8 shrink-0 p-0 text-slate-300"
                onClick={() => setMobileOpen(true)}
              >
                <span className="sr-only">Open navigation</span>
                <span className="flex h-3 w-3 flex-col justify-between">
                  <span className="h-[2px] w-3 rounded bg-slate-300" />
                  <span className="h-[2px] w-3 rounded bg-slate-400" />
                  <span className="h-[2px] w-3 rounded bg-slate-500" />
                </span>
              </Button>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-md shadow-brand-900/60">
                  <span className="text-xs font-semibold text-white">HR</span>
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-tight">
                    HRMS Lite
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Lightweight HR console
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {pathname === "/employees"
                  ? "People directory"
                  : pathname === "/attendance"
                  ? "Daily attendance"
                  : "Overview"}
              </p>
              <p className="text-[11px] text-slate-500">
                Manage employees and presence in one place.
              </p>
            </div>
            <Badge variant="neutral">Admin</Badge>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-5 md:px-6 md:py-6">
          {children}
        </main>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="h-full w-64 border-r border-slate-800/80 bg-slate-950/95 px-4 py-5 shadow-xl shadow-slate-950/80"
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-md shadow-brand-900/60">
                  <span className="text-xs font-semibold text-white">HR</span>
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-tight">
                    HRMS Lite
                  </p>
                  <p className="text-[11px] text-slate-400">Admin console</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="h-7 w-7 p-0 text-slate-400 hover:text-slate-100"
                onClick={() => setMobileOpen(false)}
              >
                <span className="sr-only">Close navigation</span>
                <span className="flex h-3 w-3 items-center justify-center">
                  <span className="block h-[2px] w-3 rotate-45 rounded bg-slate-400" />
                  <span className="block -ml-3 h-[2px] w-3 -rotate-45 rounded bg-slate-500" />
                </span>
              </Button>
            </div>
            <nav className="space-y-1 text-sm">
              {NAV_ITEMS.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${
                      active
                        ? "bg-slate-900 text-slate-50 shadow-sm shadow-slate-900/60"
                        : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-100"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto pt-6 text-[11px] text-slate-500">
              <p>Single admin. Demo HR tool.</p>
            </div>
          </div>
          <button
            type="button"
            className="flex-1 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation overlay"
          />
        </div>
      )}
    </div>
  );
}

