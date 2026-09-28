import type { ReactNode } from "react";

export function AuthLayout({
  children,
  subtitle,
  title,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 sm:grid sm:place-items-center">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl shadow-slate-900/30 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
          Flight Booking
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-2 text-slate-600">{subtitle}</p>
        <div className="mt-7">{children}</div>
      </section>
    </main>
  );
}
