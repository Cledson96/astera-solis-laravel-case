import Link from "next/link";
import type { QuizDto } from "@/lib/types";

type QuizCardProps = {
  quiz: QuizDto;
};

export function QuizCard({ quiz }: QuizCardProps) {
  return (
    <article className="border-line bg-surface rounded-lg border p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{quiz.title}</h2>
          <p className="text-muted mt-1 text-sm">
            {quiz.collection?.title ?? `Colecao #${quiz.collection_id}`}
          </p>
        </div>
        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
          {quiz.passing_score}%
        </span>
      </div>
      <p className="text-muted mt-3 text-sm leading-6">
        {quiz.description ?? "Simulado sem descricao cadastrada."}
      </p>
      <p className="text-muted mt-3 text-xs font-medium">
        {quiz.questions_count ?? 0} perguntas cadastradas na API
      </p>
      <Link
        href={`/quizzes/${quiz.id}`}
        className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Responder quiz
      </Link>
    </article>
  );
}
