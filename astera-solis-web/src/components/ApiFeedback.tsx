import { AlertTriangle, Database, Loader2 } from "lucide-react";
import Link from "next/link";

type ApiFeedbackProps = {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
};

export function LoadingState({ label = "Carregando dados da API Laravel..." }: { label?: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-foreground">{label}</p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="h-24 animate-pulse rounded-lg bg-surface-raised" />
        <div className="h-24 animate-pulse rounded-lg bg-surface-raised" />
        <div className="h-24 animate-pulse rounded-lg bg-surface-raised" />
      </div>
    </div>
  );
}

export function EmptyState({ title, message }: ApiFeedbackProps) {
  return (
    <div className="rounded-lg border border-dashed border-line-strong bg-surface p-5 text-sm shadow-sm">
      <span className="flex size-10 items-center justify-center rounded-lg bg-surface-raised text-muted">
        <Database className="size-5" aria-hidden="true" />
      </span>
      <p className="mt-4 font-semibold text-foreground">{title}</p>
      <p className="mt-2 max-w-xl leading-6 text-muted">{message}</p>
    </div>
  );
}

export function ApiFeedback(props: ApiFeedbackProps) {
  return <EmptyState {...props} />;
}

export function ErrorState({ title, message, actionHref = "/login", actionLabel = "Ir para login" }: ApiFeedbackProps) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-rose-700">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-2 leading-6">{message}</p>
          <Link
            href={actionHref}
            className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-rose-700 px-3 font-semibold text-white transition-colors hover:bg-rose-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
