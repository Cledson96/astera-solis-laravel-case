import { apiFetch } from "@/lib/api";

type ApiCollectionResponse<T> = {
  data: T[];
};

type ApiItemResponse<T> = {
  data: T;
};

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function readError(response: Response): Promise<ApiRequestError> {
  const payload = await response.json().catch(() => null);
  const message = payload?.message ?? `A API Laravel respondeu com status ${response.status}.`;

  return new ApiRequestError(response.status, message);
}

export async function readApiCollection<T>(path: string): Promise<T[]> {
  const response = await apiFetch(path);

  if (!response.ok) {
    throw await readError(response);
  }

  const payload = (await response.json()) as ApiCollectionResponse<T>;

  return payload.data;
}

export async function readApiItem<T>(path: string): Promise<T> {
  const response = await apiFetch(path);

  if (!response.ok) {
    throw await readError(response);
  }

  const payload = (await response.json()) as ApiItemResponse<T>;

  return payload.data;
}

export async function readApiRaw<T>(path: string): Promise<T> {
  const response = await apiFetch(path);

  if (!response.ok) {
    throw await readError(response);
  }

  return (await response.json()) as T;
}
