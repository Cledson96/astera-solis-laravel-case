import { ArrowRight, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/Badge";
import type { QuizDto } from "@/lib/types";

type QuizCardProps = {
  quiz: QuizDto;
  actions?: ReactNode;
};

export function QuizCard({ quiz, actions }: QuizCardProps) {
  return (
    <article className="rounded-lg border border-line bg-surface p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <ClipboardCheck className="size-5" aria-hidden="true" />
        </span>
        <Badge tone="emerald">{quiz.passing_score}% minimo</Badge>
      </div>
      <div className="mt-4">
        <h2 className="text-base font-semibold text-foreground">{quiz.title}</h2>
        <p className="mt-1 text-sm text-muted">
          {quiz.collection?.title ?? "Colecao #" + quiz.collection_id}
        </p>
      </div>
      <p className="mt-4 min-h-12 text-sm leading-6 text-muted">
        {quiz.description ?? "Simulado sem descricao cadastrada."}
      </p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="text-sm font-medium text-muted">{quiz.questions_count ?? 0} perguntas</span>
        <Link
          href={"/quizzes/" + quiz.id}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white transition-colors hover:bg-accent-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Responder
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      {actions ? <div className="mt-4 border-t border-line pt-4">{actions}</div> : null}
    </article>
  );
}
