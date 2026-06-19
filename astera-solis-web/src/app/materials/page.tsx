"use client";

import { useEffect, useState } from "react";
import { ApiFeedback, ErrorState, LoadingState } from "@/components/ApiFeedback";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { formatMaterialType } from "@/lib/format";
import { readApiCollection } from "@/lib/read-api";
import type { MaterialDto } from "@/lib/types";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<MaterialDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    readApiCollection<MaterialDto>("/api/materials")
      .then((items) => {
        if (isActive) {
          setMaterials(items);
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

  return (
    <AppShell
      current="materials"
      title="Materiais digitais"
      description="Lista operacional carregada de /api/materials com relacionamento de colecao."
    >
      {isLoading ? <LoadingState /> : null}
      {error ? <ErrorState title="Nao foi possivel listar materiais" message={error} /> : null}
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
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-line bg-background text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Titulo</th>
                  <th className="px-4 py-3 font-semibold">Tipo</th>
                  <th className="px-4 py-3 font-semibold">Colecao</th>
                  <th className="px-4 py-3 font-semibold">Tempo</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
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
