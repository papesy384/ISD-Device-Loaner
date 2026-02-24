"use client";

import { useId, useRef, useState } from "react";

export interface BarcodeScanFromFileProps {
  onScan: (value: string) => void;
  /** Button/label text (e.g. "Upload barcode image") */
  label: string;
  /** Optional accept attribute (default: image/*) */
  accept?: string;
}

/**
 * Decodes a barcode/QR from an uploaded image file. Works on any page (including HTTP on phone)
 * because it does not use the camera stream—no secure context required.
 */
export function BarcodeScanFromFile({ onScan, label, accept = "image/*" }: BarcodeScanFromFileProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const placeholderId = useId();
  const [error, setError] = useState<string | null>(null);
  const [decoding, setDecoding] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    setError(null);
    if (!file || !file.type.startsWith("image/")) return;

    setDecoding(true);
    try {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");
      const scanner = new Html5Qrcode(placeholderId, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_93,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODABAR,
          Html5QrcodeSupportedFormats.ITF,
        ],
      });
      const decoded = await scanner.scanFile(file, false);
      onScan(decoded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No barcode found in image. Try a clearer photo.");
    } finally {
      setDecoding(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        capture="environment"
        onChange={handleFile}
        disabled={decoding}
        className="hidden"
        aria-label={label}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={decoding}
        className="rounded-lg border-2 border-dashed border-isd-gold/60 bg-isd-navy/5 px-4 py-3 text-sm font-medium text-isd-navy transition-colors hover:border-isd-gold hover:bg-isd-gold/10 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-isd-gold focus:ring-offset-2"
      >
        {decoding ? "Decoding…" : label}
      </button>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      <div id={placeholderId} className="hidden" aria-hidden="true" />
    </div>
  );
}
