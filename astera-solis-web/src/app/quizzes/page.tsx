"use client";

import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { ApiFeedback, ErrorState, LoadingState } from "@/components/ApiFeedback";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { QuizCard } from "@/components/QuizCard";
import { mutateApi } from "@/lib/mutations";
import { canManageContent } from "@/lib/permissions";
import { readApiCollection, readApiRaw } from "@/lib/read-api";
import type { CollectionDto, QuizDto, UserDto } from "@/lib/types";

type QuizFormState = {
  collection_id: string;
  title: string;
  description: string;
  passing_score: string;
  active: boolean;
};

const emptyForm: QuizFormState = {
  collection_id: "",
  title: "",
  description: "",
  passing_score: "70",
  active: true,
};

function quizToForm(quiz: QuizDto): QuizFormState {
  return {
    collection_id: String(quiz.collection_id),
    title: quiz.title,
    description: quiz.description ?? "",
    passing_score: String(quiz.passing_score),
    active: quiz.active,
  };
}

function quizPayload(form: QuizFormState) {
  return {
    collection_id: Number(form.collection_id),
    title: form.title,
    description: form.description || null,
    passing_score: Number(form.passing_score),
    active: form.active,
  };
}

async function fetchQuizzesData() {
  const [currentUser, quizItems, collectionItems] = await Promise.all([
    readApiRaw<UserDto>("/api/auth/me"),
    readApiCollection<QuizDto>("/api/quizzes"),
    readApiCollection<CollectionDto>("/api/collections"),
  ]);

  return { currentUser, quizItems, collectionItems };
}

export default function QuizzesPage() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [quizzes, setQuizzes] = useState<QuizDto[]>([]);
  const [collections, setCollections] = useState<CollectionDto[]>([]);
  const [form, setForm] = useState<QuizFormState>(emptyForm);
  const [editing, setEditing] = useState<QuizDto | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadQuizzes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { currentUser, quizItems, collectionItems } = await fetchQuizzesData();

      setUser(currentUser);
      setQuizzes(quizItems);
      setCollections(collectionItems);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Nao foi possivel carregar quizzes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    fetchQuizzesData()
      .then(({ currentUser, quizItems, collectionItems }) => {
        if (isActive) {
          setUser(currentUser);
          setQuizzes(quizItems);
          setCollections(collectionItems);
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

  const canManage = canManageContent(user?.role);

  function firstCollectionId() {
    return collections[0] ? String(collections[0].id) : "";
  }

  function openCreateForm() {
    setEditing(null);
    setForm({ ...emptyForm, collection_id: firstCollectionId() });
    setFeedback(null);
    setError(null);
    setIsFormOpen(true);
  }

  function openEditForm(quiz: QuizDto) {
    setEditing(quiz);
    setForm(quizToForm(quiz));
    setFeedback(null);
    setError(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditing(null);
    setForm(emptyForm);
    setIsFormOpen(false);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleActiveChange(event: ChangeEvent<HTMLInputElement>) {
    setForm((current) => ({ ...current, active: event.target.checked }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setFeedback(null);

    try {
      if (editing) {
        await mutateApi("/api/quizzes/" + editing.id, "PUT", quizPayload(form));
        setFeedback("Quiz atualizado com sucesso.");
      } else {
        await mutateApi("/api/quizzes", "POST", quizPayload(form));
        setFeedback("Quiz criado com sucesso.");
      }

      closeForm();
      await loadQuizzes();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Nao foi possivel salvar o quiz.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(quiz: QuizDto) {
    const confirmed = window.confirm("Excluir o quiz " + quiz.title + "? Tentativas e perguntas vinculadas tambem podem ser removidas.");

    if (!confirmed) {
      return;
    }

    setError(null);
    setFeedback(null);

    try {
      await mutateApi("/api/quizzes/" + quiz.id, "DELETE");
      setFeedback("Quiz excluido com sucesso.");
      await loadQuizzes();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Nao foi possivel excluir o quiz.");
    }
  }

  function renderActions(quiz: QuizDto) {
    if (!canManage) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => openEditForm(quiz)}
          className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-muted hover:bg-surface-raised hover:text-foreground"
        >
          <Pencil className="size-4" aria-hidden="true" />
          Editar
        </button>
        <button
          type="button"
          onClick={() => handleDelete(quiz)}
          className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-rose-200 px-3 text-sm font-medium text-rose-700 hover:bg-rose-50"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Excluir
        </button>
      </div>
    );
  }

  return (
    <AppShell
      current="quizzes"
      title="Quizzes e simulados"
      description="Simulados retornados de /api/quizzes; a tentativa e corrigida pelo Laravel."
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {feedback ? <Badge tone="emerald">{feedback}</Badge> : <span />}
        {canManage ? (
          <button
            type="button"
            onClick={openCreateForm}
            disabled={collections.length === 0}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white transition-colors hover:bg-accent-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-4" aria-hidden="true" />
            Novo quiz
          </button>
        ) : null}
      </div>

      {isFormOpen && canManage ? (
        <form onSubmit={handleSubmit} className="mb-5 rounded-lg border border-line bg-surface p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">{editing ? "Editar quiz" : "Novo quiz"}</h2>
              <p className="mt-1 text-sm text-muted">Cadastre o simulado ligado a uma colecao.</p>
            </div>
            <button type="button" onClick={closeForm} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-muted hover:bg-surface-raised">
              <X className="size-4" aria-hidden="true" />
              Cancelar
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="text-sm font-semibold text-foreground">
              Colecao
              <select name="collection_id" value={form.collection_id} onChange={handleInputChange} required className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20">
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>{collection.title}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-foreground">
              Nota minima
              <input name="passing_score" type="number" min="0" max="100" value={form.passing_score} onChange={handleInputChange} required className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </label>
            <label className="md:col-span-2 text-sm font-semibold text-foreground">
              Titulo
              <input name="title" value={form.title} onChange={handleInputChange} required className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </label>
            <label className="md:col-span-2 text-sm font-semibold text-foreground">
              Descricao
              <textarea name="description" value={form.description} onChange={handleInputChange} rows={3} className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <input type="checkbox" checked={form.active} onChange={handleActiveChange} className="size-4 accent-teal-700" />
              Quiz ativo
            </label>
          </div>

          <button type="submit" disabled={isSaving} className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60">
            <Save className="size-4" aria-hidden="true" />
            {isSaving ? "Salvando..." : "Salvar quiz"}
          </button>
        </form>
      ) : null}

      {isLoading ? <LoadingState /> : null}
      {error ? <ErrorState title="Nao foi possivel processar quizzes" message={error} /> : null}
      {!isLoading && !error && quizzes.length === 0 ? (
        <ApiFeedback title="Nenhum quiz cadastrado" message="Crie quizzes pela API ou rode os seeders do Laravel." />
      ) : null}
      {quizzes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} actions={canManage ? renderActions(quiz) : undefined} />
          ))}
        </div>
      ) : null}
    </AppShell>
  );
}
