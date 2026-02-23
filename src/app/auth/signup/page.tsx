import Link from "next/link";
import { getTranslations } from "next-intl/server";
import SignupForm from "./SignupForm";

export default async function SignupPage() {
  const t = await getTranslations("signup");

  return (
    <div className="min-h-screen bg-gradient-to-b from-isd-navy/5 to-white dark:from-isd-navy dark:to-isd-navy/95">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-isd-navy hover:text-isd-gold focus:outline-none focus:ring-2 focus:ring-isd-gold focus:ring-offset-2 rounded"
        >
          <span className="text-xl font-bold tracking-tight">ISD</span>
          <span className="text-sm text-isd-navy/80">Device Loaner</span>
        </Link>

        <div className="flex flex-1 flex-col justify-center">
          <h1 className="mb-1 text-2xl font-semibold text-isd-navy">
            {t("title")}
          </h1>
          <p className="mb-8 text-isd-navy/80">{t("subtitle")}</p>

          <SignupForm />
        </div>

        <p className="mt-8 text-center text-sm text-isd-navy/70">
          <Link
            href="/"
            className="font-medium text-isd-navy underline hover:text-isd-gold"
          >
            {t("backToHome")}
          </Link>
        </p>
      </div>
    </div>
  );
}
