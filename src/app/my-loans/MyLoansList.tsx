"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/src/lib/supabase/client";
import type { Loan } from "@/src/types/database";

interface LoanWithDevice extends Loan {
  device?: { name: string } | null;
}

export default function MyLoansList() {
  const t = useTranslations("borrow");
  const [loans, setLoans] = useState<LoanWithDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function load() {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setLoans([]);
        setLoading(false);
        return;
      }
      supabase.from("loans").select("*, device:devices(name)").eq("user_id", user.id).is("returned_at", null).order("due_at").then(({ data, error }) => {
        if (error) setMessage({ type: "error", text: error.message });
        else setLoans((data as LoanWithDevice[]) ?? []);
        setLoading(false);
      });
    });
  }

  useEffect(() => { load(); }, []);

  async function handleReturn(loanId: string) {
    setMessage(null);
    setReturningId(loanId);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("loans").update({ returned_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", loanId);
      if (error) {
        setMessage({ type: "error", text: error.message });
        return;
      }
      setMessage({ type: "success", text: t("returnSuccess") });
      load();
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setReturningId(null);
    }
  }

  if (loading) return <p className="text-[#002d56]">Loading…</p>;
  if (message && message.type === "error") {
    return (
      <>
        <div role="alert" className="mb-4 rounded-lg border-2 border-[#fdb913] bg-[#fdb913]/20 px-4 py-3 text-sm" style={{ color: "#002d56" }}>{message.text}</div>
        {loans.length === 0 && <p className="text-sm opacity-90" style={{ color: "#002d56" }}>{t("noLoans")}</p>}
        {loans.length > 0 && (
          <ul className="space-y-2">
            {loans.map((l) => {
              const due = new Date(l.due_at);
              const isOverdue = due < new Date();
              return (
                <li key={l.id} className="rounded-lg border border-[#002d56]/20 bg-white px-4 py-3 text-sm" style={{ color: "#002d56" }}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{l.device?.name ?? l.device_id}</span>
                    <span className={`text-xs ${isOverdue ? "font-semibold text-red-600" : ""}`}>{t("due")} {due.toLocaleDateString()} {isOverdue ? `(${t("overdue")})` : ""}</span>
                    <button type="button" disabled={returningId !== null} onClick={() => handleReturn(l.id)} className="rounded-lg bg-[#002d56] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-70">{returningId === l.id ? "…" : t("return")}</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </>
    );
  }
  if (message?.type === "success") {
    return (
      <>
        <div role="status" className="mb-4 rounded-lg border-2 border-[#002d56]/30 bg-[#002d56]/5 px-4 py-3 text-sm" style={{ color: "#002d56" }}>{message.text}</div>
        {loans.length === 0 ? <p className="text-sm opacity-90" style={{ color: "#002d56" }}>{t("noLoans")}</p> : (
          <ul className="space-y-2">
            {loans.map((l) => {
              const due = new Date(l.due_at);
              const isOverdue = due < new Date();
              return (
                <li key={l.id} className="rounded-lg border border-[#002d56]/20 bg-white px-4 py-3 text-sm" style={{ color: "#002d56" }}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{l.device?.name ?? l.device_id}</span>
                    <span className={`text-xs ${isOverdue ? "font-semibold text-red-600" : ""}`}>{t("due")} {due.toLocaleDateString()} {isOverdue ? `(${t("overdue")})` : ""}</span>
                    <button type="button" disabled={returningId !== null} onClick={() => handleReturn(l.id)} className="rounded-lg bg-[#002d56] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-70">{returningId === l.id ? "…" : t("return")}</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </>
    );
  }
  if (loans.length === 0) return <p className="text-sm opacity-90" style={{ color: "#002d56" }}>{t("noLoans")}</p>;
  return (
    <ul className="space-y-2">
      {loans.map((l) => {
        const due = new Date(l.due_at);
        const isOverdue = due < new Date();
        return (
          <li key={l.id} className="rounded-lg border border-[#002d56]/20 bg-white px-4 py-3 text-sm" style={{ color: "#002d56" }}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">{l.device?.name ?? l.device_id}</span>
              <span className={`text-xs ${isOverdue ? "font-semibold text-red-600" : ""}`}>{t("due")} {due.toLocaleDateString()} {isOverdue ? `(${t("overdue")})` : ""}</span>
              <button type="button" disabled={returningId !== null} onClick={() => handleReturn(l.id)} className="rounded-lg bg-[#002d56] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-70">{returningId === l.id ? "…" : t("return")}</button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
