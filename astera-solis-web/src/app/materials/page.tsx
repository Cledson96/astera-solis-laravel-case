"use client";

import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { ApiFeedback, ErrorState, LoadingState } from "@/components/ApiFeedback";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { formatMaterialType } from "@/lib/format";
import { mutateApi } from "@/lib/mutations";
import { canManageContent } from "@/lib/permissions";
import { readApiCollection, readApiRaw } from "@/lib/read-api";
import type { CollectionDto, MaterialDto, UserDto } from "@/lib/types";

type MaterialFormState = {
  collection_id: string;
  title: string;
  type: string;
  summary: string;
  url: string;
  estimated_minutes: string;
  active: boolean;
};

const emptyForm: MaterialFormState = {
  collection_id: "",
  title: "",
  type: "pdf",
  summary: "",
  url: "",
  estimated_minutes: "10",
  active: true,
};

function materialToForm(material: MaterialDto): MaterialFormState {
  return {
    collection_id: String(material.collection_id),
    title: material.title,
    type: material.type,
    summary: material.summary ?? "",
    url: material.url ?? "",
    estimated_minutes: String(material.estimated_minutes),
    active: material.active,
  };
}

function materialPayload(form: MaterialFormState) {
  return {
    collection_id: Number(form.collection_id),
    title: form.title,
    type: form.type,
    summary: form.summary || null,
    url: form.url || null,
    estimated_minutes: Number(form.estimated_minutes),
    active: form.active,
  };
}

async function fetchMaterialsData() {
  const [currentUser, materialItems, collectionItems] = await Promise.all([
    readApiRaw<UserDto>("/api/auth/me"),
    readApiCollection<MaterialDto>("/api/materials"),
    readApiCollection<CollectionDto>("/api/collections"),
  ]);

  return { currentUser, materialItems, collectionItems };
}

export default function MaterialsPage() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [materials, setMaterials] = useState<MaterialDto[]>([]);
  const [collections, setCollections] = useState<CollectionDto[]>([]);
  const [form, setForm] = useState<MaterialFormState>(emptyForm);
  const [editing, setEditing] = useState<MaterialDto | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadMaterials = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { currentUser, materialItems, collectionItems } = await fetchMaterialsData();

      setUser(currentUser);
      setMaterials(materialItems);
      setCollections(collectionItems);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Nao foi possivel carregar materiais.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    fetchMaterialsData()
      .then(({ currentUser, materialItems, collectionItems }) => {
        if (isActive) {
          setUser(currentUser);
          setMaterials(materialItems);
          setCollections(collectionItems);
        }
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Nao foi possivel carregar materiais.");
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

  function openEditForm(material: MaterialDto) {
    setEditing(material);
    setForm(materialToForm(material));
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
        await mutateApi("/api/materials/" + editing.id, "PUT", materialPayload(form));
        setFeedback("Material atualizado com sucesso.");
      } else {
        await mutateApi("/api/materials", "POST", materialPayload(form));
        setFeedback("Material criado com sucesso.");
      }

      closeForm();
      await loadMaterials();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Nao foi possivel salvar o material.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(material: MaterialDto) {
    const confirmed = window.confirm("Excluir o material " + material.title + "?");

    if (!confirmed) {
      return;
    }

    setError(null);
    setFeedback(null);

    try {
      await mutateApi("/api/materials/" + material.id, "DELETE");
      setFeedback("Material excluido com sucesso.");
      await loadMaterials();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Nao foi possivel excluir o material.");
    }
  }

  function renderActions(material: MaterialDto) {
    if (!canManage) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => openEditForm(material)}
          className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-muted hover:bg-surface-raised hover:text-foreground"
        >
          <Pencil className="size-4" aria-hidden="true" />
          Editar
        </button>
        <button
          type="button"
          onClick={() => handleDelete(material)}
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
      current="materials"
      title="Materiais digitais"
      description="Lista operacional carregada de /api/materials com relacionamento de colecao."
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
            Novo material
          </button>
        ) : null}
      </div>

      {isFormOpen && canManage ? (
        <form onSubmit={handleSubmit} className="mb-5 rounded-lg border border-line bg-surface p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">{editing ? "Editar material" : "Novo material"}</h2>
              <p className="mt-1 text-sm text-muted">Vincule o recurso a uma colecao existente.</p>
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
              Tipo
              <select name="type" value={form.type} onChange={handleInputChange} required className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20">
                <option value="ebook">Ebook</option>
                <option value="video">Video</option>
                <option value="quiz">Quiz</option>
                <option value="pdf">PDF</option>
                <option value="game">Jogo</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-foreground">
              Titulo
              <input name="title" value={form.title} onChange={handleInputChange} required className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </label>
            <label className="text-sm font-semibold text-foreground">
              Tempo estimado
              <input name="estimated_minutes" type="number" min="1" value={form.estimated_minutes} onChange={handleInputChange} required className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </label>
            <label className="text-sm font-semibold text-foreground">
              URL
              <input name="url" value={form.url} onChange={handleInputChange} placeholder="https://..." className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </label>
            <label className="md:col-span-2 text-sm font-semibold text-foreground">
              Resumo
              <textarea name="summary" value={form.summary} onChange={handleInputChange} rows={3} className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <input type="checkbox" checked={form.active} onChange={handleActiveChange} className="size-4 accent-teal-700" />
              Material ativo
            </label>
          </div>

          <button type="submit" disabled={isSaving} className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60">
            <Save className="size-4" aria-hidden="true" />
            {isSaving ? "Salvando..." : "Salvar material"}
          </button>
        </form>
      ) : null}

      {isLoading ? <LoadingState /> : null}
      {error ? <ErrorState title="Nao foi possivel processar materiais" message={error} /> : null}
      {!isLoading && !error && materials.length === 0 ? (
        <ApiFeedback title="Nenhum material cadastrado" message="Crie materiais pela API ou rode os seeders do Laravel." />
      ) : null}

      {materials.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-sm">
          <div className="flex flex-col gap-2 border-b border-line bg-surface-raised px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Catalogo de materiais</h2>
              <p className="mt-1 text-sm text-muted">Recursos vinculados as colecoes didaticas.</p>
            </div>
            <Badge tone="teal">{materials.length} registros</Badge>
          </div>
          <div className="grid gap-3 p-4 md:hidden">
            {materials.map((material) => (
              <article key={material.id} className="rounded-lg border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-foreground">{material.title}</h3>
                  <Badge tone={material.active ? "emerald" : "neutral"}>
                    {material.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted">
                  {material.collection?.title ?? "Colecao #" + material.collection_id}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone="sky">{formatMaterialType(material.type)}</Badge>
                  <Badge>{material.estimated_minutes} min</Badge>
                </div>
                {canManage ? <div className="mt-4 border-t border-line pt-4">{renderActions(material)}</div> : null}
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="border-b border-line bg-background text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Titulo</th>
                  <th className="px-4 py-3 font-semibold">Tipo</th>
                  <th className="px-4 py-3 font-semibold">Colecao</th>
                  <th className="px-4 py-3 font-semibold">Tempo</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  {canManage ? <th className="px-4 py-3 font-semibold">Acoes</th> : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {materials.map((material) => (
                  <tr key={material.id} className="transition-colors hover:bg-surface-raised">
                    <td className="px-4 py-3 font-medium text-foreground">{material.title}</td>
                    <td className="px-4 py-3">
                      <Badge tone="sky">{formatMaterialType(material.type)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {material.collection?.title ?? "Colecao #" + material.collection_id}
                    </td>
                    <td className="px-4 py-3 text-muted">{material.estimated_minutes} min</td>
                    <td className="px-4 py-3">
                      <Badge tone={material.active ? "emerald" : "neutral"}>
                        {material.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                    {canManage ? <td className="px-4 py-3">{renderActions(material)}</td> : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
