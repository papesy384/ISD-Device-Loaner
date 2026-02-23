import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-2xl font-semibold" style={{ color: "#002d56" }}>
        404 — This page could not be found.
      </h1>
      <Link
        href="/"
        className="rounded-xl bg-[#002d56] px-6 py-3 font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2"
      >
        Go to home
      </Link>
    </div>
  );
}
