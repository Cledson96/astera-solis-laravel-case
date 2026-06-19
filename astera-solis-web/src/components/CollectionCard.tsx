import { ClipboardList, FileText, LibraryBig } from "lucide-react";
import { Badge } from "@/components/Badge";
import { formatSegment } from "@/lib/format";
import type { CollectionDto } from "@/lib/types";

type CollectionCardProps = {
  collection: CollectionDto;
};

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <article className="rounded-lg border border-line bg-surface p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
          <LibraryBig className="size-5" aria-hidden="true" />
        </span>
        <Badge tone={collection.active ? "teal" : "neutral"}>
          {collection.active ? "Ativa" : "Inativa"}
        </Badge>
      </div>
      <div className="mt-4">
        <h2 className="text-base font-semibold text-foreground">{collection.title}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge tone="sky">{formatSegment(collection.segment)}</Badge>
          <Badge>{collection.subject ?? "Sem disciplina"}</Badge>
        </div>
      </div>
      <p className="mt-4 min-h-12 text-sm leading-6 text-muted">
        {collection.description ?? "Colecao sem descricao cadastrada."}
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-accent-strong" aria-hidden="true" />
          <div>
            <dt className="text-muted">Materiais</dt>
            <dd className="font-semibold text-foreground">{collection.materials_count ?? 0}</dd>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ClipboardList className="size-4 text-accent-strong" aria-hidden="true" />
          <div>
            <dt className="text-muted">Quizzes</dt>
            <dd className="font-semibold text-foreground">{collection.quizzes_count ?? 0}</dd>
          </div>
        </div>
      </dl>
    </article>
  );
}
