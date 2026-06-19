import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-background text-foreground lg:grid-cols-[1fr_460px]">
      <section className="flex min-h-[320px] flex-col justify-between border-line border-b px-6 py-8 lg:border-r lg:border-b-0 lg:px-10">
        <div>
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
            Astera Solis
          </Link>
          <p className="text-muted mt-2 max-w-2xl text-sm leading-6">
            Ambiente de estudo para colecoes didaticas, materiais digitais e simulados.
          </p>
        </div>
        <dl className="mt-10 grid gap-3 text-sm sm:grid-cols-3 lg:max-w-3xl">
          <div className="border-line rounded-lg border bg-surface p-4">
            <dt className="text-muted">Perfis</dt>
            <dd className="mt-2 font-semibold">admin, editor, teacher, student</dd>
          </div>
          <div className="border-line rounded-lg border bg-surface p-4">
            <dt className="text-muted">Auth</dt>
            <dd className="mt-2 font-semibold">Sanctum cookie</dd>
          </div>
          <div className="border-line rounded-lg border bg-surface p-4">
            <dt className="text-muted">API</dt>
            <dd className="mt-2 font-semibold">Laravel + PostgreSQL</dd>
          </div>
        </dl>
      </section>

      <section className="flex items-center px-6 py-8 lg:px-10">
        <div className="w-full">
          <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
          <p className="text-muted mt-2 text-sm">Use os usuarios criados pelo seeder da API.</p>
          <div className="mt-6 rounded-lg border border-line bg-surface p-5 shadow-sm">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
