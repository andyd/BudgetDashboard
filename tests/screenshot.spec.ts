import { test } from "@playwright/test";

test.describe("Homepage Screenshot", () => {
  test("capture full page and header area", async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");

    // Wait for the page to fully load
    await page.waitForLoadState("networkidle");

    // Wait for the main heading to be visible
    await page.waitForSelector("h1", { timeout: 10000 });

    // Take full page screenshot
    await page.screenshot({
      path: "screenshots/homepage-full.png",
      fullPage: true,
    });

    // Take viewport screenshot (shows header clearly)
    await page.screenshot({
      path: "screenshots/homepage-viewport.png",
      fullPage: false,
    });

    // Take header-specific screenshot
    const header = page.locator("header, nav, h1").first();
    if (await header.isVisible()) {
      await header.screenshot({
        path: "screenshots/header-area.png",
      });
    }

    console.log("\n✓ Screenshots saved to screenshots/ directory:");
    console.log("  - homepage-full.png (entire page)");
    console.log("  - homepage-viewport.png (visible area)");
    console.log("  - header-area.png (header section)");
  });
});
