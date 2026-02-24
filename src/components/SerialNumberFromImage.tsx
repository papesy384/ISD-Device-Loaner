"use client";

import { useRef, useState } from "react";

export interface SerialNumberFromImageProps {
  onScan: (value: string) => void;
  /** Button/label text (e.g. "Read serial from label") */
  label: string;
  /** Message when OCR finds no serial-like text */
  noSerialFound?: string;
  /** Message while OCR is running */
  reading?: string;
}

/**
 * Tries to extract a serial number from OCR text.
 * Looks for patterns like "S/N: XXX", "Serial: XXX", "SN: XXX", or the longest
 * alphanumeric sequence in a typical serial length (8–30 chars).
 */
function parseSerialFromText(text: string): string | null {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return null;

  // Explicit labels (case-insensitive)
  const labelPatterns = [
    /S\/N\s*:?\s*([A-Z0-9\-]+)/i,
    /Serial\s*:?\s*([A-Z0-9\-]+)/i,
    /SN\s*:?\s*([A-Z0-9\-]+)/i,
    /Serial\s+Number\s*:?\s*([A-Z0-9\-]+)/i,
  ];
  for (const re of labelPatterns) {
    const m = normalized.match(re);
    if (m?.[1]) return m[1].trim();
  }

  // Longest alphanumeric (and common separators) sequence in serial-length range
  const tokens = normalized.match(/[A-Z0-9][A-Z0-9\-]{7,29}(?=[^A-Z0-9\-]|$)/gi);
  if (tokens?.length) {
    const best = tokens.reduce((a, b) => (a.length >= b.length ? a : b));
    return best.trim();
  }
  return null;
}

/**
 * Uses OCR (Tesseract.js) on an uploaded image to read serial number text from
 * the label (e.g. "S/N: JH6CB91LD00403J"). Use when the barcode is faded and
 * the printed serial is visible.
 */
export function SerialNumberFromImage({
  onScan,
  label,
  noSerialFound = "No serial number found in image. Try a clearer photo of the label text.",
  reading = "Reading label…",
}: SerialNumberFromImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    setError(null);
    if (!file || !file.type.startsWith("image/")) return;

    setLoading(true);
    try {
      const Tesseract = (await import("tesseract.js")).default;
      const {
        data: { text },
      } = await Tesseract.recognize(file, "eng");
      const serial = parseSerialFromText(text);
      if (serial) {
        onScan(serial);
      } else {
        setError(noSerialFound);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        disabled={loading}
        className="hidden"
        aria-label={label}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="rounded-lg border-2 border-dashed border-isd-gold/60 bg-isd-navy/5 px-4 py-3 text-sm font-medium text-isd-navy transition-colors hover:border-isd-gold hover:bg-isd-gold/10 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-isd-gold focus:ring-offset-2"
      >
        {loading ? reading : label}
      </button>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
