import { expect, test } from "@playwright/test";

test.describe("Security audit API", () => {
  test("security logs require owner session", async ({ request }) => {
    const response = await request.get("/api/security/logs");
    expect(response.status()).toBe(401);
  });

  test("security log export endpoint rejects unauthenticated POST", async ({ request }) => {
    const response = await request.post("/api/security/logs", {
      data: { limit: 10 }
    });
    expect(response.status()).toBe(401);
  });
});

test.describe("Mission workstation layout", () => {
  test("mission page does not expand horizontally", async ({ page }) => {
    await page.goto("/mission/cr001-phish-qr-phishing");
    await page.waitForLoadState("networkidle");

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth - doc.clientWidth;
    });

    expect(overflow).toBeLessThanOrEqual(8);
  });

  test("workstation shell constrains width after start room", async ({ page }) => {
    await page.goto("/mission/cr001-phish-qr-phishing");
    await page.waitForLoadState("networkidle");

    const startButton = page.getByRole("button", { name: /start room/i });
    if (!(await startButton.isVisible())) {
      test.skip(true, "Mission intro not available — seed data may be missing");
    }

    await startButton.click();

    const shell = page.locator(".font-mono.text-green-400.shadow-inner").first();
    await expect(shell).toBeVisible({ timeout: 15_000 });

    const shellOverflow = await shell.evaluate(element => {
      return element.scrollWidth - element.clientWidth;
    });

    expect(shellOverflow).toBeLessThanOrEqual(4);
  });
});
