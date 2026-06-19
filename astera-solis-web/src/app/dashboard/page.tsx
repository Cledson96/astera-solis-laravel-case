"use client";

import { ClipboardList, FileText, LibraryBig, UserCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ApiFeedback, ErrorState, LoadingState } from "@/components/ApiFeedback";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { StatCard } from "@/components/StatCard";
import { formatMaterialType, formatRole } from "@/lib/format";
import { ApiRequestError, readApiCollection, readApiRaw } from "@/lib/read-api";
import type { CollectionDto, MaterialDto, QuizDto, UserDto } from "@/lib/types";

type DashboardData = {
  user: UserDto;
  collections: CollectionDto[];
  materials: MaterialDto[];
  quizzes: QuizDto[];
};

function dashboardErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError && error.status === 401) {
    return "Entre no sistema para a API Laravel liberar as rotas protegidas pelo Sanctum.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nao foi possivel carregar os dados da API Laravel.";
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError(null);

      try {
        const [user, collections, materials, quizzes] = await Promise.all([
          readApiRaw<UserDto>("/api/auth/me"),
          readApiCollection<CollectionDto>("/api/collections"),
          readApiCollection<MaterialDto>("/api/materials"),
          readApiCollection<QuizDto>("/api/quizzes"),
        ]);

        if (isActive) {
          setData({ user, collections, materials, quizzes });
        }
      } catch (loadError) {
        if (isActive) {
          setError(dashboardErrorMessage(loadError));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, []);

  const recentMaterials = useMemo(() => data?.materials.slice(0, 5) ?? [], [data]);

  return (
    <AppShell
      current="dashboard"
      title="Dashboard"
      description="Resumo carregado da API Laravel para acompanhar colecoes, conteudos e simulados."
    >
      {isLoading ? <LoadingState /> : null}

      {error ? (
        <ErrorState title="API protegida ou indisponivel" message={error} />
      ) : null}

      {data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={UserCircle} label="Usuario" value={formatRole(data.user.role)} detail={data.user.email} tone="teal" />
            <StatCard icon={LibraryBig} label="Colecoes" value={String(data.collections.length)} detail="Trilhas didaticas retornadas pela API." tone="indigo" />
            <StatCard icon={FileText} label="Materiais" value={String(data.materials.length)} detail="Ebooks, videos, PDFs e jogos cadastrados." tone="amber" />
            <StatCard icon={ClipboardList} label="Quizzes" value={String(data.quizzes.length)} detail="Simulados disponiveis para estudantes." tone="rose" />
          </div>

          <section className="mt-6 overflow-hidden rounded-lg border border-line bg-surface shadow-sm">
            <div className="flex flex-col gap-2 border-b border-line bg-surface-raised px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">Materiais recentes</h2>
                <p className="mt-1 text-sm text-muted">Ultimos recursos retornados pelo endpoint de materiais.</p>
              </div>
              <Badge tone="teal">{recentMaterials.length} itens</Badge>
            </div>

            {recentMaterials.length === 0 ? (
              <div className="p-4">
                <ApiFeedback title="Nenhum material retornado" message="Crie materiais na API ou rode os seeders para preencher esta lista." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-line bg-background text-muted">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Item</th>
                      <th className="px-4 py-3 font-semibold">Tipo</th>
                      <th className="px-4 py-3 font-semibold">Colecao</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {recentMaterials.map((material) => (
                      <tr key={material.id} className="transition-colors hover:bg-surface-raised">
                        <td className="px-4 py-3 font-medium text-foreground">{material.title}</td>
                        <td className="px-4 py-3">
                          <Badge tone="sky">{formatMaterialType(material.type)}</Badge>
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {material.collection?.title ?? "Colecao #" + material.collection_id}
                        </td>
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
            )}
          </section>
        </>
      ) : null}
    </AppShell>
  );
}
