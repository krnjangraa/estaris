import { test, expect } from "@playwright/test";

test.describe("E2E Reports Rendering and Action Buttons Validation", () => {
  test("should load reports page with all tabs and action buttons", async ({ page }) => {
    // 1. Log in
    await page.goto("http://localhost:5173/login");
    await expect(page).toHaveURL(/.*login/);

    await page.fill("#email", "admin@estaris.com");
    await page.fill("#password", "admin123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("http://localhost:5173/");

    // 2. Navigate to Reports page
    await page.goto("http://localhost:5173/reports");
    await expect(page).toHaveURL("http://localhost:5173/reports");

    // 3. Verify page header
    await expect(page.locator("text=Reports & Analytics")).toBeVisible();

    // 4. Verify default Occupancy Tab elements
    await expect(page.locator("text=Building-wise Occupancy Breakdown")).toBeVisible();
    await expect(page.locator('button:has-text("Export Occupancy")')).toBeVisible();

    // 5. Navigate to Financial Summary Tab
    await page.click('button:has-text("Financial Summary")');
    await expect(page.locator("text=Select Financial Year:")).toBeVisible();
    await expect(page.locator('button:has-text("Export Collections")')).toBeVisible();

    // 6. Navigate to Pending Dues Tab
    await page.click('button:has-text("Pending Dues")');
    await expect(page.locator("text=Overdue Rent Accounts")).toBeVisible();
    await expect(page.locator('button:has-text("Export Pending Dues")')).toBeVisible();

    console.log("✓ E2E REPORTS PAGE LAYOUT & TABULAR INTERFACES VALIDATED SUCCESSFULLY!");
  });
});
