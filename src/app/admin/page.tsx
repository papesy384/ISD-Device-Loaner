import Link from "next/link";
import { ISDLogo } from "@/src/components/ISDLogo";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="mx-auto max-w-lg px-6 py-12">
        <ISDLogo showSubtitle={true} href="/" className="mb-8 inline-block" />
        <h1 className="mb-8 text-2xl font-semibold" style={{ color: "#002d56" }}>Admin</h1>
        <ul className="flex flex-col gap-4">
          <li>
            <Link
              href="/admin/add-device"
              className="block rounded-lg border border-[#002d56]/20 bg-white px-6 py-4 font-medium shadow transition-colors hover:border-[#fdb913] hover:bg-[#fdb913]/10 focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2"
              style={{ color: "#002d56" }}
            >
              Add Device
            </Link>
          </li>
        </ul>
        <p className="mt-8">
          <Link href="/" className="isd-brand-link text-sm underline rounded focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2" style={{ color: "#002d56" }}>
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
