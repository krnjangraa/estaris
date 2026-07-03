import { test, expect } from "@playwright/test";

test.describe("E2E Lease Flow Validation", () => {
  test("should complete the entire lifecycle of a lease", async ({ page }) => {
    // 1. Navigate to login
    await page.goto("http://localhost:5173/login");
    await expect(page).toHaveURL(/.*login/);
    console.log("✓ Navigated to Login page");

    // 2. Log in
    await page.fill("#email", "admin@estaris.com");
    await page.fill("#password", "admin123");
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL("http://localhost:5173/");
    console.log("✓ Logged in successfully");

    // 3. Create Building
    await page.click('a[href="/buildings"]');
    await expect(page).toHaveURL("http://localhost:5173/buildings");
    await page.click('button:has-text("Add Building")');
    await page.fill("#name", "E2E Test Building");
    await page.fill("#address", "789 Playwright Way");
    await page.click('button:has-text("Create Building")');
    await expect(
      page.locator("tr", { hasText: "E2E Test Building" })
    ).toBeVisible();
    console.log("✓ Created E2E Test Building");

    // 4. Navigate to Rooms and Create Room
    const bRow = page.locator("tr", { hasText: "E2E Test Building" });
    await bRow.locator("button").nth(1).click(); // Click View Rooms
    await page.waitForURL(/.*buildings\/.*\/rooms/);
    await page.click('button:has-text("Add Room")');
    await page.fill("#room_number", "R-E2E");
    await page.fill("#room_type", "Single");
    await page.fill("#capacity", "2");
    await page.fill("#base_rent", "12500");
    await page.click('button:has-text("Create Room")');
    await expect(page.locator("tr", { hasText: "R-E2E" })).toBeVisible();
    console.log("✓ Created Room R-E2E");

    // 5. Navigate to Tenants and Create Tenant
    const rRow = page.locator("tr", { hasText: "R-E2E" });
    await rRow.locator("button").nth(1).click(); // Click View Tenants
    await page.waitForURL(/.*rooms\/.*\/tenants/);
    await page.click('button:has-text("Add Tenant")');
    await page.fill('label:has-text("Name") + input', "E2E Tenant");
    await page.fill('label:has-text("Contact Number") + input', "9999988888");
    await page.fill(
      'label:has-text("Permanent Address") + input',
      "123 Playwright Blvd"
    );
    await page.fill(
      'label:has-text("Emergency Contact Name") + input',
      "E2E Emergency"
    );
    await page.fill(
      'label:has-text("Emergency Contact Number") + input',
      "8888899999"
    );
    await page.fill(
      'label:has-text("ID Proof Type") + input',
      "Aadhaar"
    );
    await page.fill(
      'label:has-text("ID Proof Number") + input',
      "999988887777"
    );
    await page.fill('label:has-text("Move In Date") + input', "2026-07-01");
    await page.click('button:has-text("Create Tenant")');
    await expect(page.locator("tr", { hasText: "E2E Tenant" })).toBeVisible();
    console.log("✓ Created E2E Tenant");

    // 6. Navigate to Leases Page
    const tRow = page.locator("tr", { hasText: "E2E Tenant" });
    await tRow.locator('button[title="View Leases"]').click();
    await page.waitForURL(/.*tenants\/.*\/leases/);
    console.log("✓ Navigated to Leases page");

    // 7. Create Lease
    await page.click('button:has-text("Add Lease")');
    await page.fill("#start_date", "2026-07-01");
    await page.fill("#end_date", "2027-06-30");
    await page.fill("#monthly_rent", "12500");
    await page.fill("#security_deposit", "25000");
    await page.fill("#payment_due_day", "5");
    await page.click('button:has-text("Create Lease")');

    // Verify lease shows in table and status is ACTIVE
    await expect(page.locator("tr", { hasText: "ACTIVE" })).toBeVisible();
    console.log("✓ Created Active Lease");

    // "Add Lease" button should be disabled now
    await expect(
      page.locator('button:has-text("Add Lease")')
    ).toBeDisabled();
    console.log("✓ Add Lease button disabled correctly");

    // 8. Edit Lease
    const lRow = page.locator("tr", { hasText: "ACTIVE" });
    await lRow.locator('button[title="Edit Lease"]').click();
    await page.fill("#monthly_rent", "13000");
    await page.click('button:has-text("Update Lease")');
    await expect(page.locator("tr", { hasText: "13,000" })).toBeVisible();
    console.log("✓ Edited Lease Rent to 13,000");

    // 9. Terminate Lease
    page.on("dialog", (dialog) => dialog.accept()); // Automatically accept confirmation
    await lRow.locator('button[title="Terminate Lease"]').click();
    await expect(page.locator("tr", { hasText: "TERMINATED" })).toBeVisible();
    console.log("✓ Terminated Lease successfully");

    // "Add Lease" button should be enabled now
    await expect(page.locator('button:has-text("Add Lease")')).toBeEnabled();
    console.log("✓ Add Lease button enabled after termination");

    // 10. Delete Lease
    await page.locator('button[title="Delete Lease"]').click();
    await page.locator('button:has-text("Delete")').click();
    await expect(page.locator("text=No leases found.")).toBeVisible();
    console.log("✓ Deleted Lease successfully");

    // 11. Navigate back to Tenants list and delete Tenant
    await page.locator("button:has(.lucide-arrow-left)").click();
    await page.waitForURL(/.*rooms\/.*\/tenants/);

    const tRow2 = page.locator("tr", { hasText: "E2E Tenant" });
    await tRow2.locator("button:has(.lucide-trash-2)").click();
    await page.locator('button:has-text("Delete")').click();
    await expect(page.locator("text=No tenants found.")).toBeVisible();
    console.log("✓ Deleted Tenant successfully");

    // 12. Navigate back to Rooms list and delete Room
    await page.goto("http://localhost:5173/buildings");
    const bRow2 = page.locator("tr", { hasText: "E2E Test Building" });
    await bRow2.locator("button").nth(1).click(); // Click View Rooms
    await page.waitForURL(/.*buildings\/.*\/rooms/);

    const rRow2 = page.locator("tr", { hasText: "R-E2E" });
    await rRow2.locator("button:has(.lucide-trash-2)").click();
    await page.locator('button:has-text("Delete")').click();
    await expect(page.locator("text=No rooms found.")).toBeVisible();
    console.log("✓ Deleted Room successfully");

    // 13. Navigate back to Buildings list and delete Building
    await page.goto("http://localhost:5173/buildings");
    const bRow3 = page.locator("tr", { hasText: "E2E Test Building" });
    await bRow3.locator("button:has(.lucide-trash-2)").click();
    await page.locator('button:has-text("Delete")').click();
    await expect(
      page.locator("tr", { hasText: "E2E Test Building" })
    ).toBeHidden();
    console.log("✓ Deleted Building successfully");

    console.log("\nALL E2E PLAYWRIGHT TESTS PASSED SUCCESSFULLY!");
  });
});
