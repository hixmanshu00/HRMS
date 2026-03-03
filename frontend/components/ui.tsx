import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  loading,
  className = "",
  children,
  ...rest
}) => {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:opacity-60 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary:
      "bg-brand-500 text-white hover:bg-brand-400 shadow-sm shadow-brand-900/40",
    secondary:
      "bg-slate-800 text-slate-50 hover:bg-slate-700 border border-slate-600/60",
    ghost: "text-slate-300 hover:bg-slate-900 border border-transparent",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading && (
        <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-100 border-t-transparent" />
      )}
      {children}
    </button>
  );
};

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  id,
  ...rest
}) => {
  const input = (
    <input
      id={id}
      className={`w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 ${className}`}
      {...rest}
    />
  );

  if (!label) {
    return input;
  }

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-xs font-medium uppercase tracking-wide text-slate-400"
      >
        {label}
      </label>
      {input}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  className = "",
  id,
  children,
  ...rest
}) => {
  const select = (
    <select
      id={id}
      className={`w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 ${className}`}
      {...rest}
    >
      {children}
    </select>
  );

  if (!label) {
    return select;
  }

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-xs font-medium uppercase tracking-wide text-slate-400"
      >
        {label}
      </label>
      {select}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
};

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = "",
  children,
}) => (
  <div
    className={`rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-lg shadow-slate-950/80 backdrop-blur ${className}`}
  >
    {children}
  </div>
);

export const Badge: React.FC<{
  variant?: "success" | "danger" | "neutral";
  children: React.ReactNode;
}> = ({ variant = "neutral", children }) => {
  const variants: Record<string, string> = {
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
    danger: "bg-rose-500/15 text-rose-400 border-rose-500/40",
    neutral: "bg-slate-500/15 text-slate-300 border-slate-500/40",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

