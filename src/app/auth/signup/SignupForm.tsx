"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { validateSignup } from "@/src/lib/signup-validation";
import { createClient } from "@/src/lib/supabase/client";

export default function SignupForm() {
  const t = useTranslations("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = validateSignup(email, password);

    if (!result.valid) {
      const parts: string[] = [];
      if (result.emailError) parts.push(t(`errors.${result.emailError}`));
      if (result.passwordError) parts.push(t(`errors.${result.passwordError}`));
      setErrorMessage(parts.length > 0 ? parts.join(" ") : t("errors.generic"));
      return;
    }

    setIsSubmitting(true);
    try {
      let supabase;
      try {
        supabase = createClient();
      } catch {
        setErrorMessage(t("errors.configError"));
        setIsSubmitting(false);
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/` : undefined },
      });

      if (error) {
        setErrorMessage(t("errors.authError"));
        return;
      }

      if (data?.user && !data.user.identities?.length) {
        setErrorMessage(t("errors.authError"));
        return;
      }

      setSuccessMessage(t("success"));
      setEmail("");
      setPassword("");
    } catch {
      setErrorMessage(t("errors.authError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-[#002d56]/20 bg-white p-8 shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        {successMessage && (
          <div
            role="status"
            className="rounded-lg border-2 border-[#002d56]/30 bg-[#002d56]/5 px-4 py-3 text-sm font-medium"
            style={{ color: "#002d56" }}
          >
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div
            data-testid="signup-error"
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
            disabled={isSubmitting}
            className="rounded-lg border border-[#002d56]/40 bg-white px-4 py-3 placeholder:opacity-60 focus:border-[#fdb913] focus:outline-none focus:ring-2 focus:ring-[#fdb913]/40 disabled:opacity-60"
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
            disabled={isSubmitting}
            className="rounded-lg border border-[#002d56]/40 bg-white px-4 py-3 placeholder:opacity-60 focus:border-[#fdb913] focus:outline-none focus:ring-2 focus:ring-[#fdb913]/40 disabled:opacity-60"
            style={{ color: "#002d56" }}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg px-4 py-3 font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2 disabled:opacity-70"
          style={{ backgroundColor: "#002d56" }}
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </button>
      </form>
    </div>
  );
}
