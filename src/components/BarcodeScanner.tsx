"use client";

import { useEffect, useRef, useState } from "react";

const SCANNER_ELEMENT_ID = "isd-barcode-scanner";

export interface BarcodeScannerProps {
  onScan: (value: string) => void;
  onClose: () => void;
  /** Accessible label for the scanner region (e.g. for camera permission context). */
  "aria-label"?: string;
}

/**
 * Renders the html5-qrcode camera scanner. Requests camera permission on mount.
 * On successful scan, calls onScan(decodedText) then onClose().
 */
export function BarcodeScanner({ onScan, onClose, "aria-label": ariaLabel }: BarcodeScannerProps) {
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const elementId = SCANNER_ELEMENT_ID;

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const scanner = new Html5Qrcode(elementId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 5, qrbox: { width: 250, height: 150 } },
          (decodedText) => {
            if (!mounted) return;
            onScan(decodedText);
            scanner.stop().then(() => onClose());
          },
          () => {}
        );
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Camera error");
        }
      }
    }

    startScanner();

    return () => {
      mounted = false;
      scannerRef.current?.stop().catch(() => {});
      scannerRef.current = null;
    };
  }, [onScan, onClose]);

  return (
    <div
      className="flex flex-col gap-3 rounded-lg border border-isd-gold/50 bg-isd-navy/5 p-4"
      role="region"
      aria-label={ariaLabel ?? "Barcode scanner"}
    >
      <div id={SCANNER_ELEMENT_ID} className="overflow-hidden rounded-lg" />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
