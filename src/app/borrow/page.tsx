import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ISDLogo } from "@/src/components/ISDLogo";
import BorrowList from "./BorrowList";

export default async function BorrowPage() {
  const t = await getTranslations("borrow");
  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="mx-auto max-w-lg px-6 py-12">
        <ISDLogo showSubtitle={true} href="/" className="mb-8 inline-block" />
        <h1 className="mb-2 text-2xl font-semibold" style={{ color: "#002d56" }}>{t("title")}</h1>
        <p className="mb-8 text-sm opacity-90" style={{ color: "#002d56" }}>{t("available")}</p>
        <BorrowList />
        <p className="mt-8">
          <Link href="/my-loans" className="text-sm font-medium underline rounded focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2" style={{ color: "#002d56" }}>
            {t("myLoans")}
          </Link>
        </p>
        <p className="mt-4">
          <Link href="/" className="text-sm font-medium underline rounded focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2" style={{ color: "#002d56" }}>
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
