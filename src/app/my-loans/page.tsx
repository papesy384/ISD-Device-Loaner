import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ISDLogo } from "@/src/components/ISDLogo";
import MyLoansList from "./MyLoansList";

export default async function MyLoansPage() {
  const t = await getTranslations("borrow");
  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="mx-auto max-w-lg px-6 py-12">
        <ISDLogo showSubtitle={true} href="/" className="mb-8 inline-block" />
        <h1 className="mb-8 text-2xl font-semibold" style={{ color: "#002d56" }}>{t("myLoans")}</h1>
        <p className="mb-4 text-sm opacity-90" style={{ color: "#002d56" }}>{t("currentLoans")}</p>
        <MyLoansList />
        <p className="mt-8">
          <Link href="/borrow" className="text-sm font-medium underline rounded focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2" style={{ color: "#002d56" }}>
            {t("title")}
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
