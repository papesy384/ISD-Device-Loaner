import Link from "next/link";
import { ISDLogo } from "@/src/components/ISDLogo";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f0f4f8] font-sans">
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        {/* Brand block: clear hierarchy and proximity */}
        <header className="mb-12 text-center">
          <ISDLogo showSubtitle={true} href="/" />
          <p className="mt-4 text-base leading-relaxed opacity-90" style={{ color: "#002d56" }}>
            Borrow and return school devices. Sign up or sign in to get started.
          </p>
        </header>

        {/* Actions: affordance (buttons), one primary and one secondary */}
        <section className="flex flex-col gap-4" aria-label="Actions">
          <Link
            href="/auth/signup"
            className="flex flex-1 items-center justify-center rounded-xl px-6 py-4 text-center font-semibold text-white shadow-md transition-all hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2 active:scale-[0.98]"
            style={{ backgroundColor: "#002d56", minHeight: 52 }}
          >
            Sign up
          </Link>
          <Link
            href="/auth/signin"
            className="flex flex-1 items-center justify-center rounded-xl border-2 px-6 py-4 text-center font-semibold transition-all hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2 active:scale-[0.98]"
            style={{ borderColor: "#002d56", color: "#002d56", minHeight: 52 }}
          >
            Sign in
          </Link>
          <Link
            href="/admin"
            className="flex flex-1 items-center justify-center rounded-xl border-2 px-6 py-4 text-center font-semibold transition-all hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2 active:scale-[0.98]"
            style={{ borderColor: "#002d56", color: "#002d56", minHeight: 52 }}
          >
            Admin
          </Link>
        </section>

        {/* Footer: subtle, consistent placement */}
        <p className="mt-10 text-center text-sm opacity-75" style={{ color: "#002d56" }}>
          International School of Dakar · Device Loaner
        </p>
      </main>
    </div>
  );
}
