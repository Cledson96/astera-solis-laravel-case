"use client";

import { useEffect, useState } from "react";
import { ApiFeedback, ErrorState, LoadingState } from "@/components/ApiFeedback";
import { AppShell } from "@/components/AppShell";
import { CollectionCard } from "@/components/CollectionCard";
import { readApiCollection } from "@/lib/read-api";
import type { CollectionDto } from "@/lib/types";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    readApiCollection<CollectionDto>("/api/collections")
      .then((items) => {
        if (isActive) {
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

  return (
    <AppShell
      current="collections"
      title="Colecoes didaticas"
      description="Colecoes retornadas de /api/collections, com contadores calculados no Laravel."
    >
      {isLoading ? <LoadingState /> : null}
      {error ? <ErrorState title="Nao foi possivel listar colecoes" message={error} /> : null}
      {!isLoading && !error && collections.length === 0 ? (
        <ApiFeedback title="Nenhuma colecao cadastrada" message="Rode os seeders ou crie colecoes pela API Laravel." />
      ) : null}
      {collections.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : null}
    </AppShell>
  );
}
