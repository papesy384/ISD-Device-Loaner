import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = locales.includes((localeCookie as Locale) ?? "en") ? (localeCookie as Locale) : "en";

  const messages = (await import(`../messages/${locale}.json`)).default;
  return { locale, messages };
});
