"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/src/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile, ProfileRole } from "@/src/types/database";

export default function HomeActions() {
  const t = useTranslations("home");
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!mounted) return;
        setUser(u ?? null);
        if (!u) {
          setProfile(null);
          setLoading(false);
          return;
        }
        const { data: existingProfile } = await supabase.from("profiles").select("*").eq("id", u.id).maybeSingle();
        if (!mounted) return;
        if (!existingProfile && u.email) {
          await supabase.from("profiles").insert({
            id: u.id,
            email: u.email,
            role: (u.email.endsWith("@faculty.isd.sn") ? "admin" : "student") as ProfileRole,
          });
          const { data: created } = await supabase.from("profiles").select("*").eq("id", u.id).single();
          if (mounted) setProfile(created ?? null);
        } else {
          setProfile((existingProfile as Profile) ?? null);
        }
      } catch {
        if (mounted) setUser(null);
        setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function handleSignOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch {
      router.refresh();
    }
  }

  if (loading) {
    return (
      <section className="flex flex-col gap-4" aria-label="Actions">
        <div className="flex flex-1 items-center justify-center rounded-xl border-2 px-6 py-4 text-center opacity-70" style={{ borderColor: "#002d56", color: "#002d56", minHeight: 52 }}>
          Loading…
        </div>
      </section>
    );
  }

  if (user && profile) {
    const isAdmin = profile.role === "admin";
    return (
      <section className="flex flex-col gap-4" aria-label="Actions">
        <p className="text-center text-sm font-medium" style={{ color: "#002d56" }}>
          {t("signedInAs", { email: user.email ?? "" })}
        </p>
        {isAdmin && (
          <>
            <Link
              href="/admin"
              className="flex flex-1 items-center justify-center rounded-xl px-6 py-4 text-center font-semibold text-white shadow-md transition-all hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2 active:scale-[0.98]"
              style={{ backgroundColor: "#002d56", minHeight: 52 }}
            >
              Admin
            </Link>
            <Link
              href="/admin/add-device"
              className="flex flex-1 items-center justify-center rounded-xl border-2 px-6 py-4 text-center font-semibold transition-all hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2 active:scale-[0.98]"
              style={{ borderColor: "#002d56", color: "#002d56", minHeight: 52 }}
            >
              Add Device
            </Link>
          </>
        )}
        {!isAdmin && (
          <>
            <Link
              href="/borrow"
              className="flex flex-1 items-center justify-center rounded-xl px-6 py-4 text-center font-semibold text-white shadow-md transition-all hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2 active:scale-[0.98]"
              style={{ backgroundColor: "#002d56", minHeight: 52 }}
            >
              Borrow
            </Link>
            <Link
              href="/my-loans"
              className="flex flex-1 items-center justify-center rounded-xl border-2 px-6 py-4 text-center font-semibold transition-all hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2 active:scale-[0.98]"
              style={{ borderColor: "#002d56", color: "#002d56", minHeight: 52 }}
            >
              My loans
            </Link>
          </>
        )}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex flex-1 items-center justify-center rounded-xl border-2 px-6 py-4 text-center font-semibold transition-all hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2 active:scale-[0.98]"
          style={{ borderColor: "#002d56", color: "#002d56", minHeight: 52 }}
        >
          {t("signOut")}
        </button>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4" aria-label="Actions">
      <Link
        href="/auth/signup"
        className="flex flex-1 items-center justify-center rounded-xl px-6 py-4 text-center font-semibold text-white shadow-md transition-all hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2 active:scale-[0.98]"
        style={{ backgroundColor: "#002d56", minHeight: 52 }}
      >
        Sign up
      </Link>
      <Link
        href="/auth/signin"
        className="flex flex-1 items-center justify-center rounded-xl border-2 px-6 py-4 text-center font-semibold transition-all hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2 active:scale-[0.98]"
        style={{ borderColor: "#002d56", color: "#002d56", minHeight: 52 }}
      >
        Sign in
      </Link>
    </section>
  );
}
