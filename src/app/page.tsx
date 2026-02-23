import { getTranslations } from "next-intl/server";
import { ISDLogo } from "@/src/components/ISDLogo";
import HomeActions from "./HomeActions";

export default async function Home() {
  const t = await getTranslations("home");

  return (
    <div className="min-h-screen bg-[#f0f4f8] font-sans">
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <header className="mb-12 text-center">
          <ISDLogo showSubtitle={true} href="/" />
          <p className="mt-4 text-base leading-relaxed opacity-90" style={{ color: "#002d56" }}>
            {t("tagline")}
          </p>
        </header>

        <HomeActions />

        <p className="mt-10 text-center text-sm opacity-75" style={{ color: "#002d56" }}>
          International School of Dakar · Device Loaner
        </p>
      </main>
    </div>
  );
}
