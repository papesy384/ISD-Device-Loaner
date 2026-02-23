"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BarcodeScanner } from "@/src/components/BarcodeScanner";

type Status = "available" | "loaned" | "repair";
type Condition = "new" | "good" | "fair" | "poor";

export default function AddDeviceForm() {
  const t = useTranslations("admin.addDevice");
  const [name, setName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [status, setStatus] = useState<Status>("available");
  const [condition, setCondition] = useState<Condition>("good");
  const [showScanner, setShowScanner] = useState(false);

  function handleScan(value: string) {
    setSerialNumber(value);
    setShowScanner(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: submit to Supabase
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
          onChange={(e) => setStatus(e.target.value as Status)}
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
          onChange={(e) => setCondition(e.target.value as Condition)}
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
        className="rounded-lg bg-isd-navy px-4 py-3 font-medium text-white transition-colors hover:bg-isd-navy/90 focus:outline-none focus:ring-2 focus:ring-isd-gold focus:ring-offset-2"
      >
        {t("submit")}
      </button>
    </form>
  );
}
