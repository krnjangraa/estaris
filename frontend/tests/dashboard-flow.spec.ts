import { test, expect } from "@playwright/test";

test.describe("E2E Dashboard Rendering and Metrics Validation", () => {
  test("should load the dashboard with correct cards and sections", async ({ page }) => {
    // 1. Log in
    await page.goto("http://localhost:5173/login");
    await expect(page).toHaveURL(/.*login/);

    await page.fill("#email", "admin@estaris.com");
    await page.fill("#password", "admin123");
    await page.click('button[type="submit"]');

    // 2. Assert URL is root (Dashboard)
    await expect(page).toHaveURL("http://localhost:5173/");

    // 3. Verify Header Greeting
    await expect(page.locator("text=Welcome back,")).toBeVisible();
    await expect(page.locator("text=System Active:")).toBeVisible();

    // 4. Verify metric cards are present
    await expect(page.locator("text=Total Buildings")).toBeVisible();
    await expect(page.locator("text=Total Rooms")).toBeVisible();
    await expect(page.locator("text=Occupancy Rate")).toBeVisible();
    await expect(page.locator("text=Collected this Month")).toBeVisible();

    // 5. Verify sections are present
    await expect(page.getByRole("heading", { name: "Occupancy by Building" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Recent Activity" })).toBeVisible();

    console.log("✓ E2E DASHBOARD LAYOUT & METRICS SECTIONS VERIFIED SUCCESSFULLY!");
  });
});
