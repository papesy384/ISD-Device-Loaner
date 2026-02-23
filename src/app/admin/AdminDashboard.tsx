"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { createClient } from "@/src/lib/supabase/client";
import type { Device, Loan } from "@/src/types/database";

interface LoanRow extends Loan {
  device?: { name: string; serial_number: string } | null;
  profile?: { email: string } | null;
}

export default function AdminDashboard() {
  const t = useTranslations("admin.dashboard");
  const [devices, setDevices] = useState<Device[]>([]);
  const [loans, setLoans] = useState<LoanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const supabase = createClient();
        const [devRes, loansRes] = await Promise.all([
          supabase.from("devices").select("*").order("created_at", { ascending: false }),
          supabase.from("loans").select("*, device:devices(name, serial_number), profile:profiles(email)").is("returned_at", null).order("due_at", { ascending: true }),
        ]);
        if (!mounted) return;
        if (devRes.error) throw devRes.error;
        if (loansRes.error) throw loansRes.error;
        setDevices((devRes.data as Device[]) ?? []);
        setLoans((loansRes.data as LoanRow[]) ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <p className="text-[#002d56]">Loading…</p>;
  if (error) return <p className="text-red-600" role="alert">{error}</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <h2 className="text-xl font-semibold" style={{ color: "#002d56" }}>{t("devicesTitle")}</h2>
        <Link
          href="/admin/add-device"
          className="rounded-lg bg-[#fdb913] px-4 py-2 font-medium transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#002d56] focus:ring-offset-2"
          style={{ color: "#002d56" }}
        >
          {t("addDevice")}
        </Link>
      </div>
      {devices.length === 0 ? (
        <p className="text-sm opacity-90" style={{ color: "#002d56" }}>{t("noDevices")}</p>
      ) : (
        <ul className="space-y-2">
          {devices.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#002d56]/20 bg-white px-4 py-3 text-sm" style={{ color: "#002d56" }}>
              <span className="font-medium">{d.name}</span>
              <span className="text-xs opacity-80">{d.serial_number}</span>
              <span className="rounded px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: d.status === "available" ? "#e8f5e9" : d.status === "loaned" ? "#fff3e0" : "#ffebee", color: "#002d56" }}>{d.status}</span>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-semibold" style={{ color: "#002d56" }}>{t("loansTitle")}</h2>
      {loans.length === 0 ? (
        <p className="text-sm opacity-90" style={{ color: "#002d56" }}>{t("noLoans")}</p>
      ) : (
        <ul className="space-y-2">
          {loans.map((l) => {
            const due = new Date(l.due_at);
            const isOverdue = !l.returned_at && due < new Date();
            return (
              <li key={l.id} className="rounded-lg border border-[#002d56]/20 bg-white px-4 py-3 text-sm" style={{ color: "#002d56" }}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{l.device?.name ?? l.device_id}</span>
                  <span className="text-xs">{l.profile?.email ?? l.user_id}</span>
                  <span className={`text-xs ${isOverdue ? "font-semibold text-red-600" : "opacity-80"}`}>
                    {t("due")} {due.toLocaleDateString()} {isOverdue ? `(${t("overdue")})` : ""}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="pt-4">
        <Link href="/" className="text-sm font-medium underline rounded focus:outline-none focus:ring-2 focus:ring-[#fdb913] focus:ring-offset-2" style={{ color: "#002d56" }}>
          {t("backToHome")}
        </Link>
      </p>
    </div>
  );
}
