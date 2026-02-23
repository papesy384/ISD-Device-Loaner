import { getTranslations } from "next-intl/server";
import { ISDLogo } from "@/src/components/ISDLogo";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const t = await getTranslations("admin.dashboard");
  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="mx-auto max-w-lg px-6 py-12">
        <ISDLogo showSubtitle={true} href="/" className="mb-8 inline-block" />
        <h1 className="mb-8 text-2xl font-semibold" style={{ color: "#002d56" }}>{t("title")}</h1>
        <AdminDashboard />
      </div>
    </div>
  );
}
