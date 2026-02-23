import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ISDLogo } from "@/src/components/ISDLogo";
import AddDeviceForm from "./AddDeviceForm";

export default async function AddDevicePage() {
  const t = await getTranslations("admin.addDevice");

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="mx-auto max-w-lg px-6 py-12">
        <ISDLogo showSubtitle={true} href="/" className="mb-6 inline-block" />
        <Link
          href="/admin"
          className="isd-brand-link mb-8 inline-block text-sm font-medium underline rounded focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2"
          style={{ color: "#002d56" }}
        >
          {t("backToAdmin")}
        </Link>

        <h1 className="mb-6 text-2xl font-semibold" style={{ color: "#002d56" }}>{t("title")}</h1>

        <div className="rounded-2xl border border-[#002d56]/20 bg-white p-8 shadow-lg">
          <AddDeviceForm />
        </div>
      </div>
    </div>
  );
}
