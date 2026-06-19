"use client";

import { CheckCircle2, Send, XCircle } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Badge } from "@/components/Badge";
import { apiFetch, csrf } from "@/lib/api";
import type { QuizAttemptDto, QuizDto } from "@/lib/types";

type QuizAttemptFormProps = {
  quiz: QuizDto;
};

export function QuizAttemptForm({ quiz }: QuizAttemptFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attempt, setAttempt] = useState<QuizAttemptDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const questions = useMemo(() => quiz.questions ?? [], [quiz.questions]);

  const answeredCount = useMemo(
    () => questions.filter((question) => answers[String(question.id)]).length,
    [answers, questions],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempt(null);
    setError(null);
    setIsSubmitting(true);

    try {
      await csrf();
      const response = await apiFetch("/api/quizzes/" + quiz.id + "/attempts", {
        method: "POST",
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.message ?? "Nao foi possivel enviar a tentativa para a API.");
        return;
      }

      const payload = (await response.json()) as { data: QuizAttemptDto };
      setAttempt(payload.data);
    } catch {
      setError("Nao foi possivel conectar com a API Laravel.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-surface p-5 text-sm shadow-sm">
        <p className="font-semibold text-foreground">Este quiz ainda nao tem perguntas na API.</p>
        <p className="mt-2 text-muted">Cadastre perguntas no seeder ou pelo banco para praticar tentativas.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {questions.map((question, index) => (
        <fieldset key={question.id} className="rounded-lg border border-line bg-surface p-4 shadow-sm">
          <legend className="px-1 text-sm font-semibold text-foreground">
            {index + 1}. {question.statement}
          </legend>
          <div className="mt-4 grid gap-2">
            {Object.entries(question.options).map(([option, label]) => {
              const id = String(question.id) + "-" + option;
              const selected = answers[String(question.id)] === option;
              const optionClasses = [
                "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition",
                selected
                  ? "border-accent bg-accent-soft text-foreground"
                  : "border-line bg-white text-foreground hover:border-accent hover:bg-surface-raised",
              ].join(" ");

              return (
                <label key={option} htmlFor={id} className={optionClasses}>
                  <input
                    id={id}
                    name={"question-" + question.id}
                    type="radio"
                    value={option}
                    checked={selected}
                    onChange={() => setAnswers((current) => ({ ...current, [String(question.id)]: option }))}
                    className="size-4 accent-teal-700"
                    required
                  />
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white text-xs font-bold text-accent-strong">
                    {option}
                  </span>
                  <span className="text-muted">{label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">{answeredCount} de {questions.length} respondidas</p>
            <Badge tone="emerald">Minimo {quiz.passing_score}%</Badge>
          </div>
          {attempt ? (
            <p className={attempt.approved ? "mt-2 flex items-center gap-2 text-sm font-semibold text-success" : "mt-2 flex items-center gap-2 text-sm font-semibold text-danger"}>
              {attempt.approved ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <XCircle className="size-4" aria-hidden="true" />}
              Resultado da API: {attempt.score}% ({attempt.approved ? "aprovado" : "revisar"})
            </p>
          ) : null}
          {error ? <p className="mt-2 text-sm font-semibold text-danger">{error}</p> : null}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || answeredCount < questions.length}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Enviando..." : "Enviar respostas"}
          <Send className="size-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
