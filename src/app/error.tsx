"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isConfigError =
    error.message?.includes("NEXT_PUBLIC_SUPABASE") ||
    error.message?.includes("Missing");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-12">
      <h1 className="text-xl font-semibold text-[#002d56]">Something went wrong</h1>
      <p className="max-w-md text-center text-sm text-[#002d56]/90">
        {isConfigError ? (
          <>
            The app is not fully configured. If you just deployed to Vercel, add
            <strong className="block mt-2">NEXT_PUBLIC_SUPABASE_URL</strong> and
            <strong className="block mt-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</strong>
            in your Vercel project → Settings → Environment Variables, then redeploy.
          </>
        ) : (
          "A client-side error occurred. Try refreshing the page."
        )}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-xl bg-[#002d56] px-6 py-3 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2"
      >
        Try again
      </button>
    </div>
  );
}
