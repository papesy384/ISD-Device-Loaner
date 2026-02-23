import { test, expect } from "@playwright/test";

test.describe("Admin Add Device", () => {
  test("Add Device form loads with Serial Number and Scan Barcode button", async ({
    page,
  }) => {
    await page.goto("/admin/add-device");

    await expect(page.getByRole("heading", { name: /add device/i })).toBeVisible();
    await expect(page.getByLabel(/serial number/i)).toBeVisible();
    await expect(page.getByTestId("scan-barcode-button")).toBeVisible();
    await expect(page.getByRole("button", { name: /scan barcode/i })).toBeVisible();
  });

  test("scanner component loads and camera permission is requested when clicking Scan Barcode", async ({
    page,
    context,
  }) => {
    // Grant camera permission so the scanner can start (camera permission is requested by the scanner)
    await context.grantPermissions(["camera"]);

    await page.goto("/admin/add-device");

    // Click Scan Barcode to open the scanner
    await page.getByTestId("scan-barcode-button").click();

    // Scanner region should be visible (component loaded)
    const scannerRegion = page.getByRole("region", {
      name: /camera barcode scanner/i,
    });
    await expect(scannerRegion).toBeVisible();

    // Scanner container is the target element for html5-qrcode; library injects content (e.g. video) when camera starts
    const scannerContainer = page.locator("#isd-barcode-scanner");
    await expect(scannerContainer).toBeVisible();

    // html5-qrcode injects a video element when the camera stream starts (after permission is granted)
    await expect(scannerContainer.locator("video")).toBeVisible({ timeout: 15000 });

    // Stop scan so the test leaves the page in a clean state
    await page.getByRole("button", { name: /stop scan/i }).click();
    await expect(scannerRegion).not.toBeVisible();
  });
});
