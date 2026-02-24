"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BarcodeScanner } from "@/src/components/BarcodeScanner";
import { BarcodeScanFromFile } from "@/src/components/BarcodeScanFromFile";
import { SerialNumberFromImage } from "@/src/components/SerialNumberFromImage";
import { createClient } from "@/src/lib/supabase/client";
import type { DeviceStatus, DeviceCondition } from "@/src/types/database";

export default function AddDeviceForm() {
  const t = useTranslations("admin.addDevice");
  const [name, setName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [status, setStatus] = useState<DeviceStatus>("available");
  const [condition, setCondition] = useState<DeviceCondition>("good");
  const [showScanner, setShowScanner] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleScan(value: string) {
    setSerialNumber(value);
    setShowScanner(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("devices").insert({
        name: name.trim(),
        serial_number: serialNumber.trim(),
        status,
        condition,
      });
      if (error) {
        setMessage({ type: "error", text: error.message });
        return;
      }
      setMessage({ type: "success", text: "Device added." });
      setName("");
      setSerialNumber("");
      setStatus("available");
      setCondition("good");
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {message && (
        <div
          role={message.type === "error" ? "alert" : "status"}
          className={`rounded-lg border-2 px-4 py-3 text-sm font-medium ${message.type === "error" ? "border-[#fdb913] bg-[#fdb913]/20" : "border-[#002d56]/30 bg-[#002d56]/5"}`}
          style={{ color: "#002d56" }}
        >
          {message.text}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label htmlFor="device-name" className="text-sm font-medium text-isd-navy">
          {t("name")}
        </label>
        <input
          id="device-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          className="rounded-lg border border-isd-navy/30 bg-white px-4 py-3 text-isd-navy placeholder:text-isd-navy/50 focus:border-isd-gold focus:outline-none focus:ring-2 focus:ring-isd-gold/30 dark:border-isd-gold/30 dark:bg-isd-navy/10 dark:placeholder:text-isd-gold/50"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="serial-number" className="text-sm font-medium text-isd-navy">
          {t("serialNumber")}
        </label>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              id="serial-number"
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder={t("serialNumberPlaceholder")}
              className="flex-1 rounded-lg border border-isd-navy/30 bg-white px-4 py-3 text-isd-navy placeholder:text-isd-navy/50 focus:border-isd-gold focus:outline-none focus:ring-2 focus:ring-isd-gold/30 dark:border-isd-gold/30 dark:bg-isd-navy/10 dark:placeholder:text-isd-gold/50"
              aria-describedby={showScanner ? "scanner-region" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowScanner((s) => !s)}
              className="rounded-lg bg-isd-gold px-4 py-3 font-medium text-isd-navy transition-colors hover:bg-isd-gold/90 focus:outline-none focus:ring-2 focus:ring-isd-navy focus:ring-offset-2"
              data-testid="scan-barcode-button"
            >
              {showScanner ? t("stopScan") : t("scanBarcode")}
            </button>
          </div>
          <p className="text-xs opacity-80" style={{ color: "var(--isd-navy, #002d56)" }}>
            {t("serialNumberHint")}
          </p>
          <div className="flex flex-wrap gap-2">
            <BarcodeScanFromFile onScan={handleScan} label={t("scanFromPhoto")} />
            <SerialNumberFromImage
              onScan={handleScan}
              label={t("readSerialFromLabel")}
              noSerialFound={t("readSerialNoFound")}
              reading={t("readSerialReading")}
            />
          </div>
        </div>
        {showScanner && (
          <div id="scanner-region" className="mt-2" role="region" aria-label="Camera barcode scanner">
            <BarcodeScanner
              onScan={handleScan}
              onClose={() => setShowScanner(false)}
              aria-label="Camera barcode scanner - permission may be requested"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="status" className="text-sm font-medium text-isd-navy">
          {t("status")}
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as DeviceStatus)}
          className="rounded-lg border border-isd-navy/30 bg-white px-4 py-3 text-isd-navy focus:border-isd-gold focus:outline-none focus:ring-2 focus:ring-isd-gold/30 dark:border-isd-gold/30 dark:bg-isd-navy/10"
        >
          <option value="available">{t("statusAvailable")}</option>
          <option value="loaned">{t("statusLoaned")}</option>
          <option value="repair">{t("statusRepair")}</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="condition" className="text-sm font-medium text-isd-navy">
          {t("condition")}
        </label>
        <select
          id="condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value as DeviceCondition)}
          className="rounded-lg border border-isd-navy/30 bg-white px-4 py-3 text-isd-navy focus:border-isd-gold focus:outline-none focus:ring-2 focus:ring-isd-gold/30 dark:border-isd-gold/30 dark:bg-isd-navy/10"
        >
          <option value="new">{t("conditionNew")}</option>
          <option value="good">{t("conditionGood")}</option>
          <option value="fair">{t("conditionFair")}</option>
          <option value="poor">{t("conditionPoor")}</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-isd-navy px-4 py-3 font-medium text-white transition-colors hover:bg-isd-navy/90 focus:outline-none focus:ring-2 focus:ring-isd-gold focus:ring-offset-2 disabled:opacity-70"
      >
        {isSubmitting ? "…" : t("submit")}
      </button>
    </form>
  );
}
