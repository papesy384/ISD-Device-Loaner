import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get("NEXT_LOCALE")?.value;
  const locale: Locale =
    typeof cookieValue === "string" && locales.includes(cookieValue as Locale)
      ? (cookieValue as Locale)
      : "en";

  const messages = (await import(`../messages/${locale}.json`)).default;
  return { locale, messages };
});
