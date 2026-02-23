import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex max-w-3xl flex-col items-center gap-8 px-6 py-16">
        <Link
          href="/"
          className="text-xl font-semibold text-isd-navy hover:text-isd-navy/90"
        >
          ISD Device Loaner
        </Link>
        <p className="text-zinc-600 dark:text-zinc-400">
          <Link
            href="/auth/signup"
            className="font-medium text-isd-navy underline hover:text-isd-gold"
          >
            Sign up
          </Link>{" "}
          to get started.
        </p>
      </main>
    </div>
  );
}
