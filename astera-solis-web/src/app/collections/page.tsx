"use client";

import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { ApiFeedback, ErrorState, LoadingState } from "@/components/ApiFeedback";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { CollectionCard } from "@/components/CollectionCard";
import { mutateApi } from "@/lib/mutations";
import { canManageContent } from "@/lib/permissions";
import { readApiCollection, readApiRaw } from "@/lib/read-api";
import type { CollectionDto, UserDto } from "@/lib/types";

type CollectionFormState = {
  title: string;
  slug: string;
  description: string;
  segment: string;
  subject: string;
  active: boolean;
};

const emptyForm: CollectionFormState = {
  title: "",
  slug: "",
  description: "",
  segment: "fundamental",
  subject: "",
  active: true,
};

function collectionToForm(collection: CollectionDto): CollectionFormState {
  return {
    title: collection.title,
    slug: collection.slug,
    description: collection.description ?? "",
    segment: collection.segment,
    subject: collection.subject ?? "",
    active: collection.active,
  };
}

function collectionPayload(form: CollectionFormState) {
  return {
    title: form.title,
    slug: form.slug,
    description: form.description || null,
    segment: form.segment,
    subject: form.subject || null,
    active: form.active,
  };
}

async function fetchCollectionsData() {
  const [currentUser, items] = await Promise.all([
    readApiRaw<UserDto>("/api/auth/me"),
    readApiCollection<CollectionDto>("/api/collections"),
  ]);

  return { currentUser, items };
}

export default function CollectionsPage() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [collections, setCollections] = useState<CollectionDto[]>([]);
  const [form, setForm] = useState<CollectionFormState>(emptyForm);
  const [editing, setEditing] = useState<CollectionDto | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadCollections = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { currentUser, items } = await fetchCollectionsData();

      setUser(currentUser);
      setCollections(items);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Nao foi possivel carregar colecoes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    fetchCollectionsData()
      .then(({ currentUser, items }) => {
        if (isActive) {
          setUser(currentUser);
          setCollections(items);
        }
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Nao foi possivel carregar colecoes.");
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

  function openCreateForm() {
    setEditing(null);
    setForm(emptyForm);
    setFeedback(null);
    setError(null);
    setIsFormOpen(true);
  }

  function openEditForm(collection: CollectionDto) {
    setEditing(collection);
    setForm(collectionToForm(collection));
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
        await mutateApi("/api/collections/" + editing.id, "PUT", collectionPayload(form));
        setFeedback("Colecao atualizada com sucesso.");
      } else {
        await mutateApi("/api/collections", "POST", collectionPayload(form));
        setFeedback("Colecao criada com sucesso.");
      }

      closeForm();
      await loadCollections();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Nao foi possivel salvar a colecao.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(collection: CollectionDto) {
    const confirmed = window.confirm("Excluir a colecao " + collection.title + "? Materiais e quizzes vinculados tambem podem ser removidos.");

    if (!confirmed) {
      return;
    }

    setError(null);
    setFeedback(null);

    try {
      await mutateApi("/api/collections/" + collection.id, "DELETE");
      setFeedback("Colecao excluida com sucesso.");
      await loadCollections();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Nao foi possivel excluir a colecao.");
    }
  }

  return (
    <AppShell
      current="collections"
      title="Colecoes didaticas"
      description="Colecoes retornadas de /api/collections, com contadores calculados no Laravel."
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {feedback ? <Badge tone="emerald">{feedback}</Badge> : <span />}
        {canManage ? (
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white transition-colors hover:bg-accent-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Plus className="size-4" aria-hidden="true" />
            Nova colecao
          </button>
        ) : null}
      </div>

      {isFormOpen && canManage ? (
        <form onSubmit={handleSubmit} className="mb-5 rounded-lg border border-line bg-surface p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">{editing ? "Editar colecao" : "Nova colecao"}</h2>
              <p className="mt-1 text-sm text-muted">Preencha os dados usados pelo endpoint de colecoes.</p>
            </div>
            <button
              type="button"
              onClick={closeForm}
              className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-muted hover:bg-surface-raised"
            >
              <X className="size-4" aria-hidden="true" />
              Cancelar
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="text-sm font-semibold text-foreground">
              Titulo
              <input name="title" value={form.title} onChange={handleInputChange} required className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </label>
            <label className="text-sm font-semibold text-foreground">
              Slug
              <input name="slug" value={form.slug} onChange={handleInputChange} required className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </label>
            <label className="text-sm font-semibold text-foreground">
              Segmento
              <select name="segment" value={form.segment} onChange={handleInputChange} required className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20">
                <option value="infantil">Infantil</option>
                <option value="fundamental">Fundamental</option>
                <option value="medio">Medio</option>
                <option value="eja">EJA</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-foreground">
              Disciplina
              <input name="subject" value={form.subject} onChange={handleInputChange} className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </label>
            <label className="md:col-span-2 text-sm font-semibold text-foreground">
              Descricao
              <textarea name="description" value={form.description} onChange={handleInputChange} rows={3} className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <input type="checkbox" checked={form.active} onChange={handleActiveChange} className="size-4 accent-teal-700" />
              Colecao ativa
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="size-4" aria-hidden="true" />
            {isSaving ? "Salvando..." : "Salvar colecao"}
          </button>
        </form>
      ) : null}

      {isLoading ? <LoadingState /> : null}
      {error ? <ErrorState title="Nao foi possivel processar colecoes" message={error} /> : null}
      {!isLoading && !error && collections.length === 0 ? (
        <ApiFeedback title="Nenhuma colecao cadastrada" message="Rode os seeders ou crie colecoes pela API Laravel." />
      ) : null}
      {collections.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              actions={canManage ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openEditForm(collection)}
                    className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-muted hover:bg-surface-raised hover:text-foreground"
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(collection)}
                    className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-rose-200 px-3 text-sm font-medium text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Excluir
                  </button>
                </div>
              ) : undefined}
            />
          ))}
        </div>
      ) : null}
    </AppShell>
  );
}
