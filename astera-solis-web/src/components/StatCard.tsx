type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  tone: "teal" | "indigo" | "amber" | "rose";
};

const toneClasses = {
  teal: "bg-teal-50 text-teal-700 border-teal-200",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  amber: "bg-amber-50 text-amber-800 border-amber-200",
  rose: "bg-rose-50 text-rose-700 border-rose-200",
};

export function StatCard({ label, value, detail, tone }: StatCardProps) {
  return (
    <section className="border-line bg-surface rounded-lg border p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-muted text-sm font-medium">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <span className={`rounded-md border px-2 py-1 text-xs font-medium ${toneClasses[tone]}`}>
          ativo
        </span>
      </div>
      <p className="text-muted mt-3 text-sm leading-5">{detail}</p>
    </section>
  );
}
