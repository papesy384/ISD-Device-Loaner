"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";

/**
 * Handles the redirect from Supabase after email confirmation (or other OTP types).
 * Supabase sends token_hash and type in the query; we verify and redirect to home.
 */
export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    if (!token_hash || !type) {
      window.location.href = "/";
      return;
    }

    let mounted = true;

    (async () => {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as "email" | "magiclink" | "recovery" | "signup" | "email_change",
        });
        if (!mounted) return;
        if (error) {
          setStatus("error");
          window.location.href = "/auth/signup?error=invalid_token";
          return;
        }
        setStatus("success");
        window.location.href = "/";
      } catch {
        if (mounted) {
          setStatus("error");
          window.location.href = "/auth/signup?error=invalid_token";
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f4f8]">
      <p className="text-lg text-[#002d56]">
        {status === "loading" && "Confirming your email…"}
        {status === "success" && "Redirecting…"}
        {status === "error" && "Redirecting…"}
      </p>
    </div>
  );
}
