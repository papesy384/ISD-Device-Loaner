import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ISDLogo } from "@/src/components/ISDLogo";
import SigninForm from "./SigninForm";

export default async function SigninPage() {
  const t = await getTranslations("signin");

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-12">
        <div className="mb-8">
          <ISDLogo showSubtitle={true} href="/" />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <h1 className="mb-1 text-2xl font-semibold" style={{ color: "#002d56" }}>
            {t("title")}
          </h1>
          <p className="mb-8 text-base opacity-90" style={{ color: "#002d56" }}>
            {t("subtitle")}
          </p>

          <SigninForm />
        </div>

        <p className="mt-8 text-center text-sm opacity-90" style={{ color: "#002d56" }}>
          <Link
            href="/"
            className="font-medium underline rounded focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2"
            style={{ color: "#002d56" }}
          >
            {t("backToHome")}
          </Link>
        </p>
      </div>
    </div>
  );
}
