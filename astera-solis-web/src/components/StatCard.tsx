import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  tone: "teal" | "indigo" | "amber" | "rose";
  icon?: LucideIcon;
};

const toneClasses = {
  teal: "bg-teal-50 text-teal-800 border-teal-200",
  indigo: "bg-indigo-50 text-indigo-800 border-indigo-200",
  amber: "bg-amber-50 text-amber-900 border-amber-200",
  rose: "bg-rose-50 text-rose-800 border-rose-200",
};

export function StatCard({ label, value, detail, tone, icon: Icon }: StatCardProps) {
  return (
    <section className="rounded-lg border border-line bg-surface p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
        </div>
        {Icon ? (
          <span className={"flex size-10 items-center justify-center rounded-lg border " + toneClasses[tone]}>
            <Icon className="size-5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-5 text-muted">{detail}</p>
    </section>
  );
}
