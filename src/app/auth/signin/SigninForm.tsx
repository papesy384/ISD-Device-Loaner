"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/src/lib/supabase/client";

export default function SigninForm() {
  const t = useTranslations("signin");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
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
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) {
        setErrorMessage(t("errors.authError"));
        setIsSubmitting(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setErrorMessage(t("errors.authError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-[#002d56]/20 bg-white p-8 shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        {errorMessage && (
          <div
            data-testid="signin-error"
            role="alert"
            className="rounded-lg border-2 border-[#fdb913] bg-[#fdb913]/20 px-4 py-3 text-sm font-medium"
            style={{ color: "#002d56" }}
          >
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="signin-email" className="text-sm font-medium" style={{ color: "#002d56" }}>
            {t("email")}
          </label>
          <input
            id="signin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            disabled={isSubmitting}
            required
            className="rounded-lg border border-[#002d56]/40 bg-white px-4 py-3 placeholder:opacity-60 focus:border-[#fdb913] focus:outline-none focus:ring-2 focus:ring-[#fdb913]/40 disabled:opacity-60"
            style={{ color: "#002d56" }}
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="signin-password" className="text-sm font-medium" style={{ color: "#002d56" }}>
            {t("password")}
          </label>
          <input
            id="signin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("passwordPlaceholder")}
            disabled={isSubmitting}
            required
            className="rounded-lg border border-[#002d56]/40 bg-white px-4 py-3 placeholder:opacity-60 focus:border-[#fdb913] focus:outline-none focus:ring-2 focus:ring-[#fdb913]/40 disabled:opacity-60"
            style={{ color: "#002d56" }}
            autoComplete="current-password"
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
