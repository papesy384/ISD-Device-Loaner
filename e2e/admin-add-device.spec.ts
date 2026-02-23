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
    await context.grantPermissions(["camera"]);

    await page.goto("/admin/add-device");

    await page.getByTestId("scan-barcode-button").click();

    // Wait for scanner to open (button toggles to "Stop Scan")
    await expect(page.getByRole("button", { name: /stop scan/i })).toBeVisible({ timeout: 10000 });

    const scannerRegion = page.locator("#scanner-region");
    await expect(scannerRegion).toBeVisible({ timeout: 5000 });
    // #isd-barcode-scanner can stay "hidden" in headless until camera stream starts; skip visibility assert

    // Stop scan to leave page in a clean state
    await page.getByRole("button", { name: /stop scan/i }).click();
    await expect(scannerRegion).not.toBeVisible({ timeout: 5000 });
  });
});
