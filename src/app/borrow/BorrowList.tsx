"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/src/lib/supabase/client";
import type { Device } from "@/src/types/database";

const DEFAULT_LOAN_DAYS = 7;

export default function BorrowList() {
  const t = useTranslations("borrow");
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [borrowingId, setBorrowingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function load() {
    const supabase = createClient();
    supabase.from("devices").select("*").eq("status", "available").order("name").then(({ data, error }) => {
      if (error) setMessage({ type: "error", text: error.message });
      else setDevices((data as Device[]) ?? []);
      setLoading(false);
    });
  }

  useEffect(() => { load(); }, []);

  async function handleBorrow(deviceId: string) {
    setMessage(null);
    setBorrowingId(deviceId);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage({ type: "error", text: "Sign in to borrow." });
        return;
      }
      const due = new Date();
      due.setDate(due.getDate() + DEFAULT_LOAN_DAYS);
      const { error } = await supabase.from("loans").insert({
        user_id: user.id,
        device_id: deviceId,
        due_at: due.toISOString(),
      });
      if (error) {
        setMessage({ type: "error", text: error.message });
        return;
      }
      setMessage({ type: "success", text: t("success") });
      load();
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setBorrowingId(null);
    }
  }

  if (loading) return <p className="text-[#002d56]">Loading…</p>;
  if (message) {
    const isError = message.type === "error";
    return (
      <>
        <div role={isError ? "alert" : "status"} className={`mb-4 rounded-lg border-2 px-4 py-3 text-sm ${isError ? "border-[#fdb913] bg-[#fdb913]/20" : "border-[#002d56]/30 bg-[#002d56]/5"}`} style={{ color: "#002d56" }}>
          {message.text}
        </div>
        {devices.length === 0 && <p className="text-sm opacity-90" style={{ color: "#002d56" }}>{t("noDevices")}</p>}
        <ul className="space-y-2">
          {devices.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-4 rounded-lg border border-[#002d56]/20 bg-white px-4 py-3" style={{ color: "#002d56" }}>
              <span className="font-medium">{d.name}</span>
              <button
                type="button"
                disabled={borrowingId !== null}
                onClick={() => handleBorrow(d.id)}
                className="rounded-lg bg-[#002d56] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70"
              >
                {borrowingId === d.id ? "…" : t("borrow")}
              </button>
            </li>
          ))}
        </ul>
      </>
    );
  }
  if (devices.length === 0) return <p className="text-sm opacity-90" style={{ color: "#002d56" }}>{t("noDevices")}</p>;
  return (
    <ul className="space-y-2">
      {devices.map((d) => (
        <li key={d.id} className="flex items-center justify-between gap-4 rounded-lg border border-[#002d56]/20 bg-white px-4 py-3" style={{ color: "#002d56" }}>
          <span className="font-medium">{d.name}</span>
          <button
            type="button"
            disabled={borrowingId !== null}
            onClick={() => handleBorrow(d.id)}
            className="rounded-lg bg-[#002d56] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70"
          >
            {borrowingId === d.id ? "…" : t("borrow")}
          </button>
        </li>
      ))}
    </ul>
  );
}
