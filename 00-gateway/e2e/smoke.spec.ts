import { test, expect } from "@playwright/test";

test.describe("Synthia-avatar Smoke Tests", () => {
  test("homepage loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Agent Alex/i);
    await expect(page.locator("body")).toBeVisible();
  });

  test("no critical console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const criticalErrors = errors.filter(
      (e) => !e.includes("Failed to fetch") && !e.includes("net::ERR")
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("Alex nameplate renders", async ({ page }) => {
    await page.goto("/");
    // Badge text should be visible (ALEX nameplate)
    const nameplate = page.getByText("ALEX");
    await expect(nameplate).toBeVisible({ timeout: 8000 });
  });

  test("language toggle button exists", async ({ page }) => {
    await page.goto("/");
    // Language switcher: shows EN (when in ES) or ES (when in EN)
    const langBtn = page.locator("button").filter({ hasText: /^(EN|ES)$/ });
    await expect(langBtn).toBeVisible();
  });

  test("NFT toggle button exists", async ({ page }) => {
    await page.goto("/");
    const nftBtn = page.locator("button").filter({ hasText: "NFT" });
    await expect(nftBtn).toBeVisible();
  });

  test("critical resources respond with 200", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });
});
