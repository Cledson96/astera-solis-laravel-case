"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorState, LoadingState } from "@/components/ApiFeedback";
import { AppShell } from "@/components/AppShell";
import { QuizAttemptForm } from "@/components/QuizAttemptForm";
import { readApiItem } from "@/lib/read-api";
import type { QuizDto } from "@/lib/types";

export default function QuizPage() {
  const params = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<QuizDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    readApiItem<QuizDto>(`/api/quizzes/${params.id}`)
      .then((item) => {
        if (isActive) {
          setQuiz(item);
        }
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Nao foi possivel carregar o quiz.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [params.id]);

  return (
    <AppShell
      current="quizzes"
      title={quiz?.title ?? "Quiz"}
      description={
        quiz
          ? `${quiz.collection?.title ?? `Colecao #${quiz.collection_id}`}. Nota minima: ${quiz.passing_score}%.`
          : "Carregando quiz da API Laravel."
      }
    >
      <div className="mb-4">
        <Link
          href="/quizzes"
          className="text-sm font-medium text-teal-700 hover:text-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Voltar para quizzes
        </Link>
      </div>
      {isLoading ? <LoadingState label="Carregando perguntas do quiz..." /> : null}
      {error ? <ErrorState title="Nao foi possivel abrir o quiz" message={error} /> : null}
      {quiz ? <QuizAttemptForm quiz={quiz} /> : null}
    </AppShell>
  );
}
