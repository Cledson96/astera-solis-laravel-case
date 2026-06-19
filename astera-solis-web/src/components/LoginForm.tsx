"use client";

import { ArrowRight, Lock, Mail } from "lucide-react";
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
        <label htmlFor="email" className="text-sm font-semibold text-foreground">
          Email
        </label>
        <div className="mt-2 flex h-11 items-center gap-2 rounded-lg border border-line bg-white px-3 transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
          <Mail className="size-4 text-muted" aria-hidden="true" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
            autoComplete="email"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-semibold text-foreground">
          Senha
        </label>
        <div className="mt-2 flex h-11 items-center gap-2 rounded-lg border border-line bg-white px-3 transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
          <Lock className="size-4 text-muted" aria-hidden="true" />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
            autoComplete="current-password"
            required
          />
        </div>
      </div>
      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Entrando..." : "Entrar no painel"}
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}
