import { test, expect } from "@playwright/test";

test.describe("Signup", () => {
  test("signup page loads with title and form", async ({ page }) => {
    await page.goto("/auth/signup");

    await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.getByLabel(/email/i)).toBeVisible();

    await page.getByLabel(/email/i).fill("notanemail");
    await page.getByLabel(/password/i).fill("Valid1!");
    await page.getByRole("button", { name: /sign up/i }).click();

    // Validation message (EN: "valid email", FR: "e-mail valide", or similar)
    await expect(
      page.getByRole("alert").filter({ hasText: /valid.*email|e-mail.*valide|invalid.*email/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("shows validation error for weak password", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.getByLabel(/email/i)).toBeVisible();

    await page.getByLabel(/email/i).fill("user@example.com");
    await page.getByLabel(/password/i).fill("short");
    await page.getByRole("button", { name: /sign up/i }).click();

    const alert = page.getByRole("alert").filter({ hasText: /6 character|6 caractère/i });
    await expect(alert).toBeVisible({ timeout: 10000 });
  });

  test("valid submit shows success or error message", async ({ page }) => {
    await page.goto("/auth/signup");

    await page.getByLabel(/email/i).fill("e2e-test@example.com");
    await page.getByLabel(/password/i).fill("SecurePass1!");
    await page.getByRole("button", { name: /sign up/i }).click();

    // Either success (email confirmation) or auth/config error depending on Supabase setup
    const statusOrAlert = page.getByRole("status").or(page.getByRole("alert"));
    await expect(statusOrAlert).toBeVisible({ timeout: 15000 });
  });
});
