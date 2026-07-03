import { test, expect } from "@playwright/test";

test.describe("E2E Payment Flow Validation", () => {
  test("should complete the entire lifecycle of a payment", async ({ page }) => {
    // 1. Navigate to login and log in
    await page.goto("http://localhost:5173/login");
    await expect(page).toHaveURL(/.*login/);

    await page.fill("#email", "admin@estaris.com");
    await page.fill("#password", "admin123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("http://localhost:5173/");

    // 2. Create Building
    await page.click('a:has-text("Buildings")');
    await page.click('button:has-text("Add Building")');
    await page.fill("#name", "E2E Payment Building");
    await page.fill("#address", "777 E2E Pay Rd");
    await page.click('button:has-text("Create Building")');
    await expect(page.locator("tr", { hasText: "E2E Payment Building" })).toBeVisible();

    // 3. Navigate to Rooms and Create Room
    await page.locator("tr", { hasText: "E2E Payment Building" }).locator('button[title="View Rooms"]').click();
    await page.click('button:has-text("Add Room")');
    await page.fill("#room_number", "R-PAY-E2E");
    await page.fill("#room_type", "Double");
    await page.fill("#capacity", "2");
    await page.fill("#base_rent", "12000");
    await page.click('button:has-text("Create Room")');
    await expect(page.locator("tr", { hasText: "R-PAY-E2E" })).toBeVisible();

    // 4. Navigate to Tenants and Create Tenant
    await page.locator("tr", { hasText: "R-PAY-E2E" }).locator('button[title="View Tenants"]').click();
    await page.click('button:has-text("Add Tenant")');
    await page.fill('label:has-text("Name") + input', "E2E Pay Tenant");
    await page.fill('label:has-text("Permanent Address") + input', "E2E Address");
    await page.fill('label:has-text("Contact Number") + input', "9988776655");
    await page.fill('label:has-text("Emergency Contact Name") + input', "E2E Contact");
    await page.fill('label:has-text("Emergency Contact Number") + input', "1122334455");
    await page.fill('label:has-text("ID Proof Type") + input', "Aadhar");
    await page.fill('label:has-text("ID Proof Number") + input', "1234-5678-9012");
    await page.fill('label:has-text("Move In Date") + input', "2026-07-01");
    await page.click('button:has-text("Create Tenant")');
    await expect(page.locator("tr", { hasText: "E2E Pay Tenant" })).toBeVisible();

    // 5. Navigate to Leases and Create Active Lease
    await page.locator("tr", { hasText: "E2E Pay Tenant" }).locator('button[title="View Leases"]').click();
    await page.click('button:has-text("Add Lease")');
    await page.fill("#start_date", "2026-07-01");
    await page.fill("#end_date", "2027-06-30");
    await page.fill("#monthly_rent", "12000");
    await page.fill("#security_deposit", "24000");
    await page.fill("#payment_due_day", "5");
    await page.click('button:has-text("Create Lease")');
    await expect(page.locator("tr", { hasText: "ACTIVE" })).toBeVisible();

    // 6. Navigate to Payments via "View Payments" button (CreditCard icon)
    await page.locator("tr", { hasText: "ACTIVE" }).locator('button[title="View Payments"]').click();
    await expect(page).toHaveURL(/.*leases\/.*\/payments/);
    await expect(page.locator("text=Loading...")).not.toBeVisible();
    await expect(page.locator("text=No payment records found.")).toBeVisible();

    // 7. Add Payment
    await page.click('button:has-text("Add Payment")');
    // Check that amount_paid defaults to empty or lease rent when adding? It should default to lease rent if we passed defaultAmountDue.
    await page.fill("#amount_paid", "12000");
    await page.fill("#payment_date", "2026-07-03");
    // select billing month July (7) and method UPI
    await page.selectOption("#billing_month", "7");
    await page.fill("#billing_year", "2026");
    await page.selectOption("#payment_method", "upi");
    await page.selectOption("#status", "paid");
    await page.fill("#transaction_reference", "TXN-PAY-E2E");
    await page.fill("#remarks", "E2E Test Pay");
    await page.click('button:has-text("Create Payment")');

    // Confirm payment appears in the list
    await expect(page.locator("tr", { hasText: "July 2026" })).toBeVisible();
    await expect(page.locator("tr", { hasText: "REC-202607-" })).toBeVisible();

    // 8. Edit Payment (change status to overdue and method to card)
    await page.locator("tr", { hasText: "July 2026" }).locator('button[title="Edit Payment"]').click();
    await page.selectOption("#status", "overdue");
    await page.selectOption("#payment_method", "card");
    await page.click('button:has-text("Update Payment")');
    
    // Verify updated values
    await expect(page.locator("tr", { hasText: "OVERDUE" })).toBeVisible();
    await expect(page.locator("tr", { hasText: "CARD" })).toBeVisible();

    // 9. Navigate to Global Payments Page via Sidebar
    await page.click('aside nav a[href="/payments"]');
    await expect(page).toHaveURL("http://localhost:5173/payments");
    
    // Check that our payment appears globally
    await expect(page.locator("tr", { hasText: "E2E Pay Tenant" })).toBeVisible();

    // 10. Test Filtering on Global Page
    // Filter by Status: "overdue"
    await page.selectOption("#status-filter", "overdue");
    await expect(page.locator("tr", { hasText: "E2E Pay Tenant" })).toBeVisible();
    
    // Filter by Status: "pending" (should hide E2E Pay Tenant as they are overdue)
    await page.selectOption("#status-filter", "pending");
    await expect(page.locator("tr", { hasText: "E2E Pay Tenant" })).not.toBeVisible();
    
    // Reset filters
    await page.selectOption("#status-filter", "");
    await expect(page.locator("tr", { hasText: "E2E Pay Tenant" })).toBeVisible();

    // 11. Navigate back to Leases page to delete resources in correct order
    await page.click('aside nav a[href="/buildings"]');
    await page.locator("tr", { hasText: "E2E Payment Building" }).locator('button[title="View Rooms"]').click();
    await page.locator("tr", { hasText: "R-PAY-E2E" }).locator('button[title="View Tenants"]').click();
    await page.locator("tr", { hasText: "E2E Pay Tenant" }).locator('button[title="View Leases"]').click();

    // Navigate to Payments to delete payment
    await page.locator("tr", { hasText: "ACTIVE" }).locator('button[title="View Payments"]').click();
    await page.locator("tr", { hasText: "July 2026" }).locator('button[title="Delete Payment"]').click();
    await page.click('button:has-text("Delete")');
    await expect(page.locator("text=Loading...")).not.toBeVisible();
    await expect(page.locator("text=No payment records found.")).toBeVisible();

    // Navigate back to leases
    await page.goBack();
    // Terminate and delete lease
    page.on("dialog", (dialog) => dialog.accept());
    await page.locator("tr", { hasText: "ACTIVE" }).locator('button[title="Terminate Lease"]').click();
    await expect(page.locator("tr", { hasText: "TERMINATED" })).toBeVisible();
    await page.locator("tr", { hasText: "TERMINATED" }).locator('button[title="Delete Lease"]').click();
    
    // Navigate back to Tenants to delete tenant
    await page.goBack();
    await page.locator("tr", { hasText: "E2E Pay Tenant" }).locator('button[title="Delete Tenant"]').click();

    // Navigate back to Rooms to delete room
    await page.goBack();
    await page.locator("tr", { hasText: "R-PAY-E2E" }).locator('button[title="Delete Room"]').click();

    // Navigate back to Buildings to delete building
    await page.goBack();
    await page.locator("tr", { hasText: "E2E Payment Building" }).locator('button[title="Delete Building"]').click();

    console.log("✓ ALL E2E PAYMENT FLOW OPERATIONS VALIDATED AND CLEANED UP SUCCESSFULLY!");
  });
});
