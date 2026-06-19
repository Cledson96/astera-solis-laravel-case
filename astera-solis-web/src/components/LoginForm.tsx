"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiFetch, csrf } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("student@astera.test");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await csrf();
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.message ?? "Nao foi possivel entrar com estes dados.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Nao foi possivel conectar com a API Laravel.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="border-line mt-2 h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="border-line mt-2 h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          autoComplete="current-password"
          required
        />
      </div>
      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isLoading}
        className="flex min-h-11 w-full items-center justify-center rounded-lg bg-foreground px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Entrando..." : "Entrar no painel"}
      </button>
    </form>
  );
}
