"use client";

import { useEffect, useMemo, useState } from "react";
import { ApiRequestError, readApiCollection, readApiRaw } from "@/lib/read-api";
import { ApiFeedback, ErrorState, LoadingState } from "@/components/ApiFeedback";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
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

  const recentMaterials = useMemo(() => data?.materials.slice(0, 4) ?? [], [data]);

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
            <StatCard label="Usuario" value={data.user.role} detail={data.user.email} tone="teal" />
            <StatCard label="Colecoes" value={String(data.collections.length)} detail="Trilhas didaticas retornadas pela API." tone="indigo" />
            <StatCard label="Materiais" value={String(data.materials.length)} detail="Ebooks, videos, PDFs e jogos cadastrados." tone="amber" />
            <StatCard label="Quizzes" value={String(data.quizzes.length)} detail="Simulados disponiveis para estudantes." tone="rose" />
          </div>

          <section className="mt-6 rounded-lg border border-line bg-surface p-4 shadow-sm">
            <h2 className="text-base font-semibold tracking-tight">Materiais recentes</h2>
            {recentMaterials.length === 0 ? (
              <div className="mt-4">
                <ApiFeedback title="Nenhum material retornado" message="Crie materiais na API ou rode os seeders para preencher esta lista." />
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-line text-muted">
                    <tr>
                      <th className="py-2 pr-4 font-medium">Item</th>
                      <th className="py-2 pr-4 font-medium">Tipo</th>
                      <th className="py-2 pr-4 font-medium">Colecao</th>
                      <th className="py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {recentMaterials.map((material) => (
                      <tr key={material.id}>
                        <td className="py-3 pr-4 font-medium">{material.title}</td>
                        <td className="py-3 pr-4 text-muted">{material.type}</td>
                        <td className="py-3 pr-4 text-muted">
                          {material.collection?.title ?? `Colecao #${material.collection_id}`}
                        </td>
                        <td className={material.active ? "py-3 text-emerald-700" : "py-3 text-muted"}>
                          {material.active ? "ativo" : "inativo"}
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
