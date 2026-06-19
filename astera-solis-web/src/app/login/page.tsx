import { BookOpenCheck, Database, KeyRound, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-background text-foreground lg:grid-cols-[minmax(0,1fr)_480px]">
      <section className="flex min-h-[360px] flex-col justify-between bg-slate-950 px-6 py-8 text-white lg:px-10">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            <span className="flex size-11 items-center justify-center rounded-lg bg-accent text-white shadow-sm">
              <BookOpenCheck className="size-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xl font-semibold">Astera Solis</span>
              <span className="mt-0.5 block text-sm text-slate-300">Painel editorial educacional</span>
            </span>
          </Link>
          <div className="mt-12 max-w-2xl">
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              API Laravel, sessao Sanctum e conteudo didatico em uma experiencia unica.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
              Entre como estudante para responder quizzes ou troque o email para testar outros perfis do seeder.
            </p>
          </div>
        </div>

        <dl className="mt-10 grid gap-3 text-sm sm:grid-cols-3 lg:max-w-3xl">
          <div className="rounded-lg border border-white/10 bg-white/10 p-4">
            <dt className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Auth
            </dt>
            <dd className="mt-2 font-semibold text-white">Sanctum cookie</dd>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-4">
            <dt className="flex items-center gap-2 text-slate-300">
              <Database className="size-4" aria-hidden="true" />
              Banco
            </dt>
            <dd className="mt-2 font-semibold text-white">PostgreSQL</dd>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-4">
            <dt className="flex items-center gap-2 text-slate-300">
              <KeyRound className="size-4" aria-hidden="true" />
              Perfis
            </dt>
            <dd className="mt-2 font-semibold text-white">4 roles</dd>
          </div>
        </dl>
      </section>

      <section className="flex items-center px-6 py-8 lg:px-10">
        <div className="w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Entrar</h2>
            <p className="mt-2 text-sm text-muted">Use os usuarios criados pelo seeder da API.</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-5 shadow-md">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
