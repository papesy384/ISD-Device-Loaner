import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import LocaleToggle from "@/src/components/LocaleToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "ISD Device Loaner",
  description: "Device loaner system for International School of Dakar",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let locale = "en";
  let messages: Record<string, unknown> = {};
  try {
    [locale, messages] = await Promise.all([
      getLocale(),
      getMessages().then((m) => m as Record<string, unknown>),
    ]);
  } catch {
    try {
      messages = (await import("../../messages/en.json")).default;
    } catch {
      // no-op
    }
  }

  return (
    <html lang={locale}>
      <body
        className="antialiased"
        style={{
          background: "#f4f4f5",
          color: "#18181b",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="fixed right-4 top-4 z-10">
            <LocaleToggle />
          </div>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
