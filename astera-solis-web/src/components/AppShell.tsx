import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/LogoutButton";

type AppShellProps = {
  current: "dashboard" | "collections" | "materials" | "quizzes";
  title: string;
  description: string;
  children: ReactNode;
};

const navItems = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard" },
  { key: "collections", label: "Colecoes", href: "/collections" },
  { key: "materials", label: "Materiais", href: "/materials" },
  { key: "quizzes", label: "Quizzes", href: "/quizzes" },
] as const;

export function AppShell({ current, title, description, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        <aside className="border-line bg-surface/90 border-b px-4 py-4 lg:w-64 lg:border-r lg:border-b-0 lg:px-5 lg:py-6">
          <Link href="/dashboard" className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            <span className="text-lg font-semibold tracking-tight">Astera Solis</span>
            <span className="text-muted mt-1 block text-sm">Case full stack</span>
          </Link>

          <nav className="mt-5 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {navItems.map((item) => {
              const isActive = item.key === current;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`min-w-fit rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive
                      ? "bg-foreground text-white"
                      : "text-muted hover:bg-background hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 hidden lg:block">
            <LogoutButton />
          </div>
        </aside>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <header className="mb-6 max-w-3xl">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="text-muted mt-2 max-w-2xl text-sm leading-6">{description}</p>
            <div className="mt-4 lg:hidden">
              <LogoutButton />
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
