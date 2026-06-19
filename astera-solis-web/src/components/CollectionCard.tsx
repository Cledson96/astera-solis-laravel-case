import type { CollectionDto } from "@/lib/types";

type CollectionCardProps = {
  collection: CollectionDto;
};

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <article className="border-line bg-surface rounded-lg border p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{collection.title}</h2>
          <p className="text-muted mt-1 text-sm">{collection.subject ?? "Sem disciplina definida"}</p>
        </div>
        <span className="rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700">
          {collection.segment}
        </span>
      </div>
      <p className="text-muted mt-3 text-sm leading-6">
        {collection.description ?? "Colecao sem descricao cadastrada."}
      </p>
      <dl className="border-line mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-sm">
        <div>
          <dt className="text-muted">Materiais</dt>
          <dd className="mt-1 font-semibold">{collection.materials_count ?? 0}</dd>
        </div>
        <div>
          <dt className="text-muted">Quizzes</dt>
          <dd className="mt-1 font-semibold">{collection.quizzes_count ?? 0}</dd>
        </div>
      </dl>
    </article>
  );
}
