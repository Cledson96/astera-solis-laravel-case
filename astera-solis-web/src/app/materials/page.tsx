"use client";

import { useEffect, useState } from "react";
import { ApiFeedback, ErrorState, LoadingState } from "@/components/ApiFeedback";
import { AppShell } from "@/components/AppShell";
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-line bg-background text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Titulo</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Colecao</th>
                  <th className="px-4 py-3 font-medium">Tempo</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {materials.map((material) => (
                  <tr key={material.id} className="hover:bg-background">
                    <td className="px-4 py-3 font-medium">{material.title}</td>
                    <td className="px-4 py-3 text-muted">{material.type}</td>
                    <td className="px-4 py-3 text-muted">
                      {material.collection?.title ?? `Colecao #${material.collection_id}`}
                    </td>
                    <td className="px-4 py-3 text-muted">{material.estimated_minutes} min</td>
                    <td className={material.active ? "px-4 py-3 text-emerald-700" : "px-4 py-3 text-muted"}>
                      {material.active ? "ativo" : "inativo"}
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
