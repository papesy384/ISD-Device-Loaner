"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";
import type { Profile, ProfileRole } from "@/src/types/database";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    // E2E: allow unauthenticated access so Playwright can test admin pages without real auth
    if (process.env.NEXT_PUBLIC_E2E === "true") {
      setAllowed(true);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted) return;
        if (!user) {
          router.replace("/");
          return;
        }
        let { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
        if (!mounted) return;
        if (!p && user.email) {
          const adminEmails = (typeof process.env.NEXT_PUBLIC_ADMIN_EMAILS === "string"
            ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
            : []) as string[];
          const role: ProfileRole = adminEmails.includes(user.email.toLowerCase()) ? "admin" : "student";
          await supabase.from("profiles").insert({ id: user.id, email: user.email, role });
          const { data: created } = await supabase.from("profiles").select("role").eq("id", user.id).single();
          p = created as Pick<Profile, "role"> | null;
        }
        if (!p || p.role !== "admin") {
          router.replace("/");
          return;
        }
        setAllowed(true);
      } catch {
        if (mounted) router.replace("/");
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  if (allowed === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-[#002d56]">Loading…</p>
      </div>
    );
  }
  return <>{children}</>;
}
