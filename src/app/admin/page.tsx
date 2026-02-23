import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-isd-navy/5 to-white dark:from-isd-navy dark:to-isd-navy/95">
      <div className="mx-auto max-w-lg px-6 py-12">
        <h1 className="mb-8 text-2xl font-semibold text-isd-navy">Admin</h1>
        <ul className="flex flex-col gap-4">
          <li>
            <Link
              href="/admin/add-device"
              className="block rounded-lg border border-isd-navy/20 bg-white px-6 py-4 font-medium text-isd-navy shadow transition-colors hover:border-isd-gold hover:bg-isd-gold/10 dark:border-isd-gold/20 dark:bg-isd-navy/5"
            >
              Add Device
            </Link>
          </li>
        </ul>
        <p className="mt-8">
          <Link href="/" className="text-sm text-isd-navy/70 underline hover:text-isd-gold">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
