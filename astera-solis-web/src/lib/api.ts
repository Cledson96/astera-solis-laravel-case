const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const csrfMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split("=").slice(1).join("="));
}

function jsonHeaders(headers?: HeadersInit): Headers {
  const mergedHeaders = new Headers(headers);

  if (!mergedHeaders.has("Accept")) {
    mergedHeaders.set("Accept", "application/json");
  }

  if (!mergedHeaders.has("Content-Type")) {
    mergedHeaders.set("Content-Type", "application/json");
  }

  return mergedHeaders;
}

export async function csrf(): Promise<void> {
  const response = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel iniciar a protecao CSRF.");
  }
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const headers = jsonHeaders(options.headers);
  const method = (options.method ?? "GET").toUpperCase();
  const xsrfToken = getCookie("XSRF-TOKEN");

  if (csrfMethods.has(method) && xsrfToken && !headers.has("X-XSRF-TOKEN")) {
    headers.set("X-XSRF-TOKEN", xsrfToken);
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });
}
