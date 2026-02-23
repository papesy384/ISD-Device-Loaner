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
    <div className="mx-auto w-full max-w-md rounded-2xl border border-[#002d56]/20 bg-white p-8 shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {errorMessage && (
          <div
            role="alert"
            className="rounded-lg border-2 border-[#fdb913] bg-[#fdb913]/20 px-4 py-3 text-sm font-medium"
            style={{ color: "#002d56" }}
          >
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium" style={{ color: "#002d56" }}>
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="rounded-lg border border-[#002d56]/40 bg-white px-4 py-3 placeholder:opacity-60 focus:border-[#fdb913] focus:outline-none focus:ring-2 focus:ring-[#fdb913]/40"
            style={{ color: "#002d56" }}
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium" style={{ color: "#002d56" }}>
            {t("password")}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("passwordPlaceholder")}
            className="rounded-lg border border-[#002d56]/40 bg-white px-4 py-3 placeholder:opacity-60 focus:border-[#fdb913] focus:outline-none focus:ring-2 focus:ring-[#fdb913]/40"
            style={{ color: "#002d56" }}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg px-4 py-3 font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2"
          style={{ backgroundColor: "#002d56" }}
        >
          {t("submit")}
        </button>
      </form>
    </div>
  );
}
