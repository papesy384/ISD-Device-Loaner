import { defineConfig, devices } from "@playwright/test";

/**
 * Use this config when the dev server is already running (e.g. npm run dev in another terminal).
 * Run: npx playwright test --config=playwright.no-server.config.ts
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  // Chromium only to avoid Firefox/WebKit crashes in some environments.
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // No webServer - assume app is already running at baseURL
});
