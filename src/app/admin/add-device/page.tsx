import Link from "next/link";
import { getTranslations } from "next-intl/server";
import AddDeviceForm from "./AddDeviceForm";

export default async function AddDevicePage() {
  const t = await getTranslations("admin.addDevice");

  return (
    <div className="min-h-screen bg-gradient-to-b from-isd-navy/5 to-white dark:from-isd-navy dark:to-isd-navy/95">
      <div className="mx-auto max-w-lg px-6 py-12">
        <Link
          href="/admin"
          className="mb-8 inline-block text-sm font-medium text-isd-navy underline hover:text-isd-gold"
        >
          {t("backToAdmin")}
        </Link>

        <h1 className="mb-6 text-2xl font-semibold text-isd-navy">{t("title")}</h1>

        <div className="rounded-2xl border border-isd-navy/20 bg-white p-8 shadow-lg dark:border-isd-gold/20 dark:bg-isd-navy/5">
          <AddDeviceForm />
        </div>
      </div>
    </div>
  );
}
