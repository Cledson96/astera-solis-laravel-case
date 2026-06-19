"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch, csrf } from "@/lib/api";

type LogoutButtonProps = {
  tone?: "dark" | "light";
};

const toneClasses = {
  dark: "border-white/10 text-slate-300 hover:bg-white/10 hover:text-white",
  light: "border-line bg-surface text-muted hover:bg-surface-raised hover:text-foreground",
};

export function LogoutButton({ tone = "light" }: LogoutButtonProps) {
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
      className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60 ${toneClasses[tone]}`}
    >
      <LogOut className="size-4" aria-hidden="true" />
      {isLoading ? "Saindo..." : "Sair"}
    </button>
  );
}
