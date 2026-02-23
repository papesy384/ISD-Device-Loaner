"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { validateSignup } from "@/src/lib/signup-validation";

export default function SignupForm() {
  const t = useTranslations("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const result = validateSignup(email, password);

    if (result.valid) {
      // TODO: call Supabase signup
      return;
    }

    const parts: string[] = [];
    if (result.emailError) parts.push(t(`errors.${result.emailError}`));
    if (result.passwordError) parts.push(t(`errors.${result.passwordError}`));
    setErrorMessage(parts.length > 0 ? parts.join(" ") : t("errors.generic"));
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-isd-navy/20 bg-white p-8 shadow-lg dark:border-isd-gold/20 dark:bg-isd-navy/5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {errorMessage && (
          <div
            role="alert"
            className="rounded-lg border-2 border-isd-gold bg-isd-gold/20 px-4 py-3 text-sm font-medium text-isd-navy"
          >
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-isd-navy">
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="rounded-lg border border-isd-navy/30 bg-white px-4 py-3 text-isd-navy placeholder:text-isd-navy/50 focus:border-isd-gold focus:outline-none focus:ring-2 focus:ring-isd-gold/30 dark:border-isd-gold/30 dark:bg-isd-navy/10 dark:placeholder:text-isd-gold/50"
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-isd-navy">
            {t("password")}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("passwordPlaceholder")}
            className="rounded-lg border border-isd-navy/30 bg-white px-4 py-3 text-isd-navy placeholder:text-isd-navy/50 focus:border-isd-gold focus:outline-none focus:ring-2 focus:ring-isd-gold/30 dark:border-isd-gold/30 dark:bg-isd-navy/10 dark:placeholder:text-isd-gold/50"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-isd-navy px-4 py-3 font-medium text-white transition-colors hover:bg-isd-navy/90 focus:outline-none focus:ring-2 focus:ring-isd-gold focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-isd-navy"
        >
          {t("submit")}
        </button>
      </form>
    </div>
  );
}
