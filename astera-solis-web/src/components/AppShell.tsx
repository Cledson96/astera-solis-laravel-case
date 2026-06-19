import { BookOpenCheck, ClipboardList, FileText, LayoutDashboard, LibraryBig } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";

type AppShellProps = {
  current: "dashboard" | "collections" | "materials" | "quizzes";
  title: string;
  description: string;
  children: ReactNode;
};

type NavItem = {
  key: AppShellProps["current"];
  label: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "collections", label: "Colecoes", href: "/collections", icon: LibraryBig },
  { key: "materials", label: "Materiais", href: "/materials", icon: FileText },
  { key: "quizzes", label: "Quizzes", href: "/quizzes", icon: ClipboardList },
];

export function AppShell({ current, title, description, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col lg:flex-row">
        <aside className="border-b border-white/10 bg-slate-950 px-4 py-4 text-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-r lg:border-b-0 lg:px-5 lg:py-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-white shadow-sm">
              <BookOpenCheck className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-semibold">Astera Solis</span>
              <span className="mt-0.5 block text-sm text-slate-300">Painel editorial</span>
            </span>
          </Link>

          <nav className="mt-6 grid grid-cols-2 gap-2 lg:flex lg:flex-col">
            {navItems.map((item) => {
              const isActive = item.key === current;
              const Icon = item.icon;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 hidden lg:block">
            <LogoutButton tone="dark" />
          </div>
        </aside>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <header className="mb-7 flex flex-col gap-4 border-b border-line pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-medium text-muted shadow-sm">
                <span className="size-2 rounded-full bg-success" />
                API Laravel
              </span>
              <div className="lg:hidden">
                <LogoutButton tone="light" />
              </div>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
