import type { ReactNode } from "react";

type BadgeTone = "neutral" | "teal" | "emerald" | "amber" | "rose" | "sky" | "indigo";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
};

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-line bg-surface-raised text-muted",
  teal: "border-teal-200 bg-teal-50 text-teal-800",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  rose: "border-rose-200 bg-rose-50 text-rose-800",
  sky: "border-sky-200 bg-sky-50 text-sky-800",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-800",
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded-md border px-2.5 text-xs font-semibold ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
