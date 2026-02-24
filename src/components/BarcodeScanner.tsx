"use client";

import { useEffect, useRef, useState } from "react";

const SCANNER_ELEMENT_ID = "isd-barcode-scanner";

function getCameraErrorMessage(err: unknown): string {
  const msg = err instanceof Error ? err.message : "";
  const name = err instanceof Error ? err.name : "";
  if (name === "NotAllowedError" || msg.toLowerCase().includes("permission") || msg.toLowerCase().includes("denied")) {
    return "Camera permission denied. Allow camera access in your browser or device settings.";
  }
  if (name === "NotFoundError" || msg.toLowerCase().includes("not found")) {
    return "No camera found.";
  }
  const isSecureContext = typeof window !== "undefined" && window.isSecureContext;
  if (!isSecureContext) {
    return "Camera scan needs a secure page. Use the app at its official HTTPS link (the deployed site)—then open that link on your phone and Scan Barcode will work.";
  }
  return msg || "Camera unavailable. Use the app at its HTTPS link on your phone and allow camera access.";
}

export interface BarcodeScannerProps {
  onScan: (value: string) => void;
  onClose: () => void;
  /** Accessible label for the scanner region (e.g. for camera permission context). */
  "aria-label"?: string;
}

/**
 * Renders the html5-qrcode camera scanner. Requests camera permission on mount.
 * On successful scan, calls onScan(decodedText) then onClose().
 * On mobile, camera requires HTTPS (not http:// over the network).
 */
export function BarcodeScanner({ onScan, onClose, "aria-label": ariaLabel }: BarcodeScannerProps) {
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const elementId = SCANNER_ELEMENT_ID;

    async function startScanner() {
      try {
        if (typeof window !== "undefined" && !window.isSecureContext) {
          setError(getCameraErrorMessage(null));
          return;
        }
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");
        const scanner = new Html5Qrcode(elementId, {
          verbose: false,
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
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const min = Math.min(viewfinderWidth, viewfinderHeight);
              const size = Math.floor(0.7 * min);
              return { width: size, height: Math.floor(size * 0.5) };
            },
          },
          (decodedText) => {
            if (!mounted) return;
            onScan(decodedText);
            scanner.stop().then(() => onClose());
          },
          () => {}
        );
      } catch (err) {
        if (mounted) {
          setError(getCameraErrorMessage(err));
        }
      }
    }

    const t = setTimeout(startScanner, 100);

    return () => {
      clearTimeout(t);
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
      <div id={SCANNER_ELEMENT_ID} className="min-h-[200px] overflow-hidden rounded-lg" />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
