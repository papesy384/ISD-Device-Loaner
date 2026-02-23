"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const LOCALE_COOKIE = "NEXT_LOCALE";
const LOCALES = ["en", "fr"] as const;

export default function LocaleToggle() {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const [pendingLocale, setPendingLocale] = useState<"en" | "fr" | null>(null);

  useEffect(() => {
    if (pendingLocale === null) return;
    document.cookie = `${LOCALE_COOKIE}=${pendingLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
    const id = setTimeout(() => setPendingLocale(null), 0);
    return () => clearTimeout(id);
  }, [pendingLocale, router]);

  function setLocale(next: "en" | "fr") {
    setPendingLocale(next);
  }

  return (
    <div className="flex items-center gap-2" role="group" aria-label={t("locale")}>
      {LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => setLocale(loc)}
          aria-pressed={locale === loc}
          className="rounded px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2"
          style={{
            backgroundColor: locale === loc ? "#002d56" : "transparent",
            color: locale === loc ? "white" : "#002d56",
            border: `1px solid ${locale === loc ? "#002d56" : "rgba(0,45,86,0.3)"}`,
          }}
        >
          {loc === "en" ? t("en") : t("fr")}
        </button>
      ))}
    </div>
  );
}
