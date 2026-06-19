import { apiFetch, csrf } from "@/lib/api";

type ApiErrorPayload = {
  message?: string;
  errors?: Record<string, string[]>;
};

function firstErrorMessage(payload: ApiErrorPayload | null): string | null {
  if (!payload) {
    return null;
  }

  const firstField = payload.errors ? Object.keys(payload.errors)[0] : null;
  const firstMessage = firstField ? payload.errors?.[firstField]?.[0] : null;

  return firstMessage ?? payload.message ?? null;
}

export async function mutateApi<T>(
  path: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  payload?: unknown,
): Promise<T | null> {
  await csrf();

  const response = await apiFetch(path, {
    method,
    body: payload ? JSON.stringify(payload) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(firstErrorMessage(json) ?? "Nao foi possivel salvar os dados.");
  }

  return json as T;
}
