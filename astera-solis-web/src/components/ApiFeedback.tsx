import Link from "next/link";

type ApiFeedbackProps = {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
};

export function LoadingState({ label = "Carregando dados da API Laravel..." }: { label?: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4 shadow-sm">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="h-20 animate-pulse rounded-lg bg-background" />
        <div className="h-20 animate-pulse rounded-lg bg-background" />
        <div className="h-20 animate-pulse rounded-lg bg-background" />
      </div>
    </div>
  );
}

export function EmptyState({ title, message }: ApiFeedbackProps) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-surface p-5 text-sm shadow-sm">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-muted">{message}</p>
    </div>
  );
}

export function ApiFeedback(props: ApiFeedbackProps) {
  return <EmptyState {...props} />;
}

export function ErrorState({ title, message, actionHref = "/login", actionLabel = "Ir para login" }: ApiFeedbackProps) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800 shadow-sm">
      <p className="font-semibold">{title}</p>
      <p className="mt-2">{message}</p>
      <Link
        href={actionHref}
        className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-rose-700 px-3 py-2 font-semibold text-white transition-colors hover:bg-rose-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
