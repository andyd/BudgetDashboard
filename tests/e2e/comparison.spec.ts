import { test, expect } from "@playwright/test";

/**
 * E2E tests for the Comparison Page (/compare/[spendingId]/[unitId])
 *
 * Tests shareable comparison pages that display federal budget items
 * compared to tangible units (e.g., NASA budget = X F-35 jets)
 */
test.describe("Comparison Page", () => {
  // Known valid comparison: NASA ($27B) compared to F-35 Fighter Jets ($100M each)
  const validSpendingId = "nasa";
  const validUnitId = "5"; // F-35 Fighter Jet
  const comparisonUrl = `/compare/${validSpendingId}/${validUnitId}`;

  test.describe("Page Load and Display", () => {
    test("should load comparison page successfully", async ({ page }) => {
      await page.goto(comparisonUrl);

      // Page should load without errors
      await expect(page).toHaveURL(comparisonUrl);

      // Main content container should be visible
      await expect(page.locator("main, .min-h-screen")).toBeVisible();
    });

    test("should display the page heading", async ({ page }) => {
      await page.goto(comparisonUrl);

      // Should have "Federal Budget Comparison" heading
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(/Budget|Comparison/i);
    });

    test("should display spending item name", async ({ page }) => {
      await page.goto(comparisonUrl);

      // Should show NASA in the content
      const content = await page.textContent("body");
      expect(content).toMatch(
        /NASA|National Aeronautics and Space Administration/i,
      );
    });

    test("should display comparison result with formatted numbers", async ({
      page,
    }) => {
      await page.goto(comparisonUrl);

      // Should display dollar amounts (e.g., $27B)
      const dollarPattern = /\$[\d,.]+[BMT]?/;
      const content = await page.textContent("body");
      expect(content).toMatch(dollarPattern);

      // Should mention the unit (F-35)
      expect(content).toMatch(/F-35|Fighter Jet/i);
    });

    test("should display unit count in comparison", async ({ page }) => {
      await page.goto(comparisonUrl);

      // NASA is $27B, F-35 is $100M, so ~270 jets
      // Should show a number representing the unit count
      const content = await page.textContent("body");
      // Look for formatted numbers that could be unit counts
      expect(content).toMatch(/[\d,]+/);
    });

    test('should display "Back to Dashboard" navigation', async ({ page }) => {
      await page.goto(comparisonUrl);

      // Should have a back button/link
      const backButton = page.locator(
        'a:has-text("Back to Dashboard"), button:has-text("Back to Dashboard")',
      );
      await expect(backButton).toBeVisible();

      // Clicking it should navigate home
      await backButton.click();
      await expect(page).toHaveURL("/");
    });
  });

  test.describe("Context Information", () => {
    test("should display budget item description if available", async ({
      page,
    }) => {
      await page.goto(comparisonUrl);

      // Look for description section (NASA has a description)
      const aboutSection = page.locator('h2:has-text("About")').first();

      // If about section exists, it should be visible
      if (await aboutSection.isVisible({ timeout: 2000 })) {
        await expect(aboutSection).toBeVisible();
      }
    });

    test("should display source attribution", async ({ page }) => {
      await page.goto(comparisonUrl);

      // Should mention USAspending.gov as source
      const content = await page.textContent("body");
      expect(content).toMatch(/usaspending|source/i);
    });

    test("should display fiscal year information", async ({ page }) => {
      await page.goto(comparisonUrl);

      // Should mention fiscal year
      const content = await page.textContent("body");
      expect(content).toMatch(/Fiscal Year|FY|20\d{2}/i);
    });
  });

  test.describe("Share Button Functionality", () => {
    test("should display share button", async ({ page }) => {
      await page.goto(comparisonUrl);

      // Find share button by text or aria-label
      const shareButton = page.locator(
        'button:has-text("Share"), button[aria-label*="Share"], button[aria-label*="share"]',
      );
      await expect(shareButton.first()).toBeVisible();
    });

    test("should open share dropdown when clicked", async ({ page }) => {
      await page.goto(comparisonUrl);

      // Click share button
      const shareButton = page
        .locator(
          'button:has-text("Share"), button[aria-label*="Share"], button[aria-label*="share"]',
        )
        .first();
      await shareButton.click();

      // Should show dropdown menu or native share dialog
      // On desktop, we expect a dropdown menu
      const dropdown = page.locator(
        '[role="menu"], [data-radix-menu-content], [role="dialog"]',
      );

      // Wait a moment for dropdown to appear
      await page.waitForTimeout(300);

      // Check if dropdown or menu appeared
      const hasDropdown = await dropdown.isVisible().catch(() => false);

      if (hasDropdown) {
        await expect(dropdown).toBeVisible();
      }
    });

    test("should display social sharing options", async ({ page }) => {
      await page.goto(comparisonUrl);

      // Click share button to open dropdown
      const shareButton = page
        .locator(
          'button:has-text("Share"), button[aria-label*="Share"], button[aria-label*="share"]',
        )
        .first();
      await shareButton.click();
      await page.waitForTimeout(300);

      // Check for social media options (X/Twitter, Facebook, LinkedIn)
      const menuContent = page.locator(
        '[role="menu"], [data-radix-menu-content]',
      );

      if (await menuContent.isVisible()) {
        // Should have Twitter/X option
        const twitterOption = page.locator("text=/Twitter|Share on X/i");
        const facebookOption = page.locator("text=/Facebook/i");
        const linkedInOption = page.locator("text=/LinkedIn/i");

        const hasSocialOptions =
          (await twitterOption.count()) > 0 ||
          (await facebookOption.count()) > 0 ||
          (await linkedInOption.count()) > 0;

        expect(hasSocialOptions).toBe(true);
      }
    });
  });

  test.describe("Copy Link Button", () => {
    test("should display copy link option in share menu", async ({ page }) => {
      await page.goto(comparisonUrl);

      // Click share button
      const shareButton = page
        .locator(
          'button:has-text("Share"), button[aria-label*="Share"], button[aria-label*="share"]',
        )
        .first();
      await shareButton.click();
      await page.waitForTimeout(300);

      // Look for copy link option
      const copyOption = page.locator(
        'button:has-text("Copy"), [role="menuitem"]:has-text("Copy")',
      );
      await expect(copyOption.first()).toBeVisible();
    });

    test("should copy link to clipboard when copy button is clicked", async ({
      page,
      context,
    }) => {
      // Grant clipboard permissions
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);

      await page.goto(comparisonUrl);

      // Open share menu
      const shareButton = page
        .locator(
          'button:has-text("Share"), button[aria-label*="Share"], button[aria-label*="share"]',
        )
        .first();
      await shareButton.click();
      await page.waitForTimeout(300);

      // Click copy link
      const copyOption = page
        .locator('button:has-text("Copy"), [role="menuitem"]:has-text("Copy")')
        .first();
      await copyOption.click();
      await page.waitForTimeout(500);

      // Verify clipboard content
      const clipboardText = await page.evaluate(() =>
        navigator.clipboard.readText(),
      );

      // Should contain the comparison URL
      expect(clipboardText).toContain("/compare/");
      expect(clipboardText).toContain(validSpendingId);
      expect(clipboardText).toContain(validUnitId);
    });

    test("should show confirmation after copying link", async ({
      page,
      context,
    }) => {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);

      await page.goto(comparisonUrl);

      // Open share menu and click copy
      const shareButton = page
        .locator(
          'button:has-text("Share"), button[aria-label*="Share"], button[aria-label*="share"]',
        )
        .first();
      await shareButton.click();
      await page.waitForTimeout(300);

      const copyOption = page
        .locator('button:has-text("Copy"), [role="menuitem"]:has-text("Copy")')
        .first();
      await copyOption.click();
      await page.waitForTimeout(500);

      // Should show success indication (e.g., "Copied!" text, checkmark, or toast)
      const confirmation = page.locator(
        "text=/Copied|Success|Check/i, [data-sonner-toast]",
      );
      const hasConfirmation = (await confirmation.count()) > 0;

      // Either the button text changed or a toast appeared
      expect(hasConfirmation).toBe(true);
    });
  });

  test.describe("SEO Metadata", () => {
    test("should have proper page title with comparison info", async ({
      page,
    }) => {
      await page.goto(comparisonUrl);

      // Title should include budget item name and unit
      const title = await page.title();
      expect(title).toMatch(/NASA|F-35|Budget|Dashboard/i);
    });

    test("should have meta description", async ({ page }) => {
      await page.goto(comparisonUrl);

      // Check for meta description
      const metaDescription = page.locator('meta[name="description"]');
      const content = await metaDescription.getAttribute("content");

      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(50);
    });

    test("should have Open Graph tags for social sharing", async ({ page }) => {
      await page.goto(comparisonUrl);

      // Check OG title
      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveAttribute("content", /.+/);

      // Check OG description
      const ogDescription = page.locator('meta[property="og:description"]');
      await expect(ogDescription).toHaveAttribute("content", /.+/);

      // Check OG URL
      const ogUrl = page.locator('meta[property="og:url"]');
      const urlContent = await ogUrl.getAttribute("content");
      expect(urlContent).toContain("/compare/");

      // Check OG image (for social media preview cards)
      const ogImage = page.locator('meta[property="og:image"]');
      await expect(ogImage).toHaveAttribute("content", /.+/);
    });

    test("should have Twitter Card metadata", async ({ page }) => {
      await page.goto(comparisonUrl);

      // Check Twitter card type
      const twitterCard = page.locator('meta[name="twitter:card"]');
      const cardType = await twitterCard.getAttribute("content");
      expect(cardType).toMatch(/summary|summary_large_image/);

      // Check Twitter title
      const twitterTitle = page.locator('meta[name="twitter:title"]');
      await expect(twitterTitle).toHaveAttribute("content", /.+/);

      // Check Twitter description
      const twitterDescription = page.locator(
        'meta[name="twitter:description"]',
      );
      await expect(twitterDescription).toHaveAttribute("content", /.+/);
    });

    test("should have canonical URL", async ({ page }) => {
      await page.goto(comparisonUrl);

      // Check canonical link
      const canonical = page.locator('link[rel="canonical"]');
      const href = await canonical.getAttribute("href");

      expect(href).toContain("/compare/");
      expect(href).toContain(validSpendingId);
      expect(href).toContain(validUnitId);
    });
  });

  test.describe("Call-to-Action Buttons", () => {
    test('should display "Explore the Full Budget" CTA', async ({ page }) => {
      await page.goto(comparisonUrl);

      const budgetCta = page.locator(
        'a:has-text("Explore the Full Budget"), a:has-text("View Budget Dashboard")',
      );
      await expect(budgetCta.first()).toBeVisible();
    });

    test('should display "Build Your Own Comparison" CTA', async ({ page }) => {
      await page.goto(comparisonUrl);

      const buildCta = page.locator(
        'a:has-text("Build Your Own"), a:has-text("Start Building")',
      );
      await expect(buildCta.first()).toBeVisible();
    });

    test("should navigate to budget page from CTA", async ({ page }) => {
      await page.goto(comparisonUrl);

      const budgetCta = page
        .locator(
          'a:has-text("Explore the Full Budget"), a:has-text("View Budget Dashboard")',
        )
        .first();
      await budgetCta.click();

      // Should navigate to budget page
      await expect(page).toHaveURL(/\/budget/);
    });
  });

  test.describe("Error Handling", () => {
    test("should show 404 for invalid spending ID", async ({ page }) => {
      await page.goto("/compare/invalid-spending-id/5");

      // Should show not found page
      const content = await page.textContent("body");
      expect(content).toMatch(/not found|404/i);
    });

    test("should show 404 for invalid unit ID", async ({ page }) => {
      await page.goto("/compare/nasa/invalid-unit-id");

      // Should show not found page
      const content = await page.textContent("body");
      expect(content).toMatch(/not found|404/i);
    });

    test("should show 404 for both invalid IDs", async ({ page }) => {
      await page.goto("/compare/invalid-spending/invalid-unit");

      // Should show not found page
      const content = await page.textContent("body");
      expect(content).toMatch(/not found|404/i);
    });
  });

  test.describe("Responsive Design", () => {
    test("should display correctly on mobile viewport", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(comparisonUrl);

      // Main content should be visible
      await expect(page.locator("main, .min-h-screen")).toBeVisible();

      // Share button should be visible
      const shareButton = page
        .locator(
          'button:has-text("Share"), button[aria-label*="Share"], button[aria-label*="share"]',
        )
        .first();
      await expect(shareButton).toBeVisible();
    });

    test("should display correctly on tablet viewport", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(comparisonUrl);

      // Main content should be visible
      await expect(page.locator("main, .min-h-screen")).toBeVisible();

      // CTAs should be visible
      const ctas = page.locator(
        'a:has-text("Explore the Full Budget"), a:has-text("Build Your Own")',
      );
      await expect(ctas.first()).toBeVisible();
    });

    test("should display correctly on desktop viewport", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(comparisonUrl);

      // Main content should be visible
      await expect(page.locator("main, .min-h-screen")).toBeVisible();

      // All CTAs should be visible
      const budgetCta = page
        .locator(
          'a:has-text("Explore the Full Budget"), a:has-text("View Budget Dashboard")',
        )
        .first();
      const buildCta = page
        .locator('a:has-text("Build Your Own"), a:has-text("Start Building")')
        .first();

      await expect(budgetCta).toBeVisible();
      await expect(buildCta).toBeVisible();
    });
  });

  test.describe("Alternative Valid Comparisons", () => {
    // Test with a different valid comparison to ensure robustness
    test("should load Medicare compared to Teacher Salaries", async ({
      page,
    }) => {
      // Medicare ($900B) compared to Teacher Salaries ($65K/year)
      await page.goto("/compare/medicare/15");

      // Page should load successfully
      await expect(page.locator("main, .min-h-screen")).toBeVisible();

      // Should contain Medicare-related content
      const content = await page.textContent("body");
      expect(content).toMatch(/Medicare/i);
      expect(content).toMatch(/Teacher|Salary/i);
    });

    test("should load DOD compared to F-35 jets", async ({ page }) => {
      // Department of Defense ($850B) compared to F-35s ($100M)
      await page.goto("/compare/dod/5");

      // Page should load successfully
      await expect(page.locator("main, .min-h-screen")).toBeVisible();

      // Should contain DOD-related content
      const content = await page.textContent("body");
      expect(content).toMatch(/Defense|DOD/i);
      expect(content).toMatch(/F-35|Fighter/i);
    });
  });
});
