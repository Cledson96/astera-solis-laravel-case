"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch, csrf } from "@/lib/api";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);

    try {
      await csrf();
      await apiFetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      router.push("/login");
      router.refresh();
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="min-h-10 rounded-lg border border-line px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-background hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "Saindo..." : "Sair"}
    </button>
  );
}
