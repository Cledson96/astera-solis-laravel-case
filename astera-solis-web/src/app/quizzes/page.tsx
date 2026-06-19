"use client";

import { useEffect, useState } from "react";
import { ApiFeedback, ErrorState, LoadingState } from "@/components/ApiFeedback";
import { AppShell } from "@/components/AppShell";
import { QuizCard } from "@/components/QuizCard";
import { readApiCollection } from "@/lib/read-api";
import type { QuizDto } from "@/lib/types";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    readApiCollection<QuizDto>("/api/quizzes")
      .then((items) => {
        if (isActive) {
          setQuizzes(items);
        }
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Nao foi possivel carregar quizzes.");
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
  }, []);

  return (
    <AppShell
      current="quizzes"
      title="Quizzes e simulados"
      description="Simulados retornados de /api/quizzes; a tentativa e corrigida pelo Laravel."
    >
      {isLoading ? <LoadingState /> : null}
      {error ? <ErrorState title="Nao foi possivel listar quizzes" message={error} /> : null}
      {!isLoading && !error && quizzes.length === 0 ? (
        <ApiFeedback title="Nenhum quiz cadastrado" message="Crie quizzes pela API ou rode os seeders do Laravel." />
      ) : null}
      {quizzes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      ) : null}
    </AppShell>
  );
}
