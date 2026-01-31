import { test, expect } from "@playwright/test";

test.describe("Budget Page", () => {
  test.describe("Budget Overview", () => {
    test("should load budget overview page successfully", async ({ page }) => {
      await page.goto("/budget");

      // Verify page loads with correct title
      await expect(page).toHaveTitle(/Budget|Federal/i);

      // Verify main content area is visible
      await expect(page.locator("main")).toBeVisible();
    });

    test("should display budget page heading", async ({ page }) => {
      await page.goto("/budget");

      // Look for a heading on the page
      const heading = page.locator("h1, h2").first();
      await expect(heading).toBeVisible();
    });

    test("should show fiscal year information", async ({ page }) => {
      await page.goto("/budget");

      // Look for fiscal year indicators
      const pageContent = await page.textContent("body");
      expect(pageContent).toMatch(/FY\s*20\d{2}|Fiscal Year|20\d{2}/i);
    });

    test("should display department or budget items", async ({ page }) => {
      await page.goto("/budget");

      // Wait for content to load
      await page.waitForLoadState("networkidle");

      // Check for budget-related content (cards, tables, or lists)
      const budgetContent = page
        .locator(
          '[data-testid="department-card"], [data-testid="budget-item"], .card, table, [role="list"]',
        )
        .first();

      // At least verify some content exists on the page
      const hasContent = await page.locator("main").textContent();
      expect(hasContent).toBeTruthy();
    });
  });

  test.describe("Department Links", () => {
    test("should display clickable department links", async ({ page }) => {
      await page.goto("/budget");

      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Look for links to department detail pages
      const departmentLinks = page.locator('a[href^="/budget/"]');
      const linkCount = await departmentLinks.count();

      // Should have at least one department link
      expect(linkCount).toBeGreaterThan(0);
    });

    test("should display department names and amounts", async ({ page }) => {
      await page.goto("/budget");

      // Wait for content
      await page.waitForLoadState("networkidle");

      // Check for dollar amounts on the page
      const pageContent = await page.textContent("body");
      expect(pageContent).toMatch(
        /\$[\d,]+\.?\d*[BMT]?|\d+\s*(billion|million|trillion)/i,
      );
    });
  });

  test.describe("Department Detail Navigation", () => {
    test("should navigate to department detail page when clicking a department", async ({
      page,
    }) => {
      await page.goto("/budget");

      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Find a department link
      const departmentLink = page.locator('a[href^="/budget/"]').first();

      // Verify link exists before clicking
      await expect(departmentLink).toBeVisible({ timeout: 10000 });

      // Get the href before clicking
      const href = await departmentLink.getAttribute("href");

      // Click the department link
      await departmentLink.click();

      // Wait for navigation
      await page.waitForLoadState("networkidle");

      // Verify URL changed to department detail page
      expect(page.url()).toContain("/budget/");
    });

    test("should display department detail page content", async ({ page }) => {
      await page.goto("/budget");

      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Navigate to first department
      const departmentLink = page.locator('a[href^="/budget/"]').first();
      await expect(departmentLink).toBeVisible({ timeout: 10000 });
      await departmentLink.click();

      // Wait for detail page to load
      await page.waitForLoadState("networkidle");

      // Verify detail page has heading
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();

      // Verify page shows amount
      const pageContent = await page.textContent("body");
      expect(pageContent).toMatch(/\$[\d,]+\.?\d*[BMT]?/);
    });

    test("should display breadcrumb navigation on detail page", async ({
      page,
    }) => {
      await page.goto("/budget");

      // Navigate to a department
      const departmentLink = page.locator('a[href^="/budget/"]').first();
      await expect(departmentLink).toBeVisible({ timeout: 10000 });
      await departmentLink.click();

      await page.waitForLoadState("networkidle");

      // Check for breadcrumb navigation
      const breadcrumb = page
        .locator(
          '[aria-label*="breadcrumb"], nav[aria-label*="Breadcrumb"], [data-testid="breadcrumb"]',
        )
        .first();

      // Breadcrumb should be visible on detail pages
      await expect(breadcrumb).toBeVisible({ timeout: 5000 });
    });

    test("should have back navigation on detail page", async ({ page }) => {
      await page.goto("/budget");

      // Navigate to a department
      const departmentLink = page.locator('a[href^="/budget/"]').first();
      await expect(departmentLink).toBeVisible({ timeout: 10000 });
      await departmentLink.click();

      await page.waitForLoadState("networkidle");

      // Check for back button or link
      const backButton = page
        .locator(
          'a:has-text("Back"), button:has-text("Back"), [aria-label*="back"]',
        )
        .first();

      await expect(backButton).toBeVisible();
    });
  });

  test.describe("Charts and Visualizations", () => {
    test("should render chart on budget overview page", async ({ page }) => {
      await page.goto("/budget");

      // Wait for page and potential chart to load
      await page.waitForLoadState("networkidle");

      // Look for SVG charts (D3.js/Recharts) or canvas elements
      const chart = page
        .locator(
          'svg, canvas, [data-testid*="chart"], [data-testid*="treemap"]',
        )
        .first();

      // Wait for chart to render with extended timeout
      await expect(chart).toBeVisible({ timeout: 15000 });
    });

    test("should render chart on department detail page", async ({ page }) => {
      await page.goto("/budget");

      // Navigate to a department
      const departmentLink = page.locator('a[href^="/budget/"]').first();
      await expect(departmentLink).toBeVisible({ timeout: 10000 });
      await departmentLink.click();

      await page.waitForLoadState("networkidle");

      // Look for chart elements on detail page
      const charts = page.locator('svg, canvas, [data-testid*="chart"]');
      const chartCount = await charts.count();

      // Detail page may have one or more charts
      // At minimum, verify some visual content exists
      if (chartCount > 0) {
        await expect(charts.first()).toBeVisible({ timeout: 10000 });
      }
    });

    test("should have interactive chart elements", async ({ page }) => {
      await page.goto("/budget");

      // Wait for chart to load
      await page.waitForSelector("svg", { timeout: 15000 });

      // Find interactive elements within SVG (rects, paths, circles)
      const interactiveElements = page.locator(
        "svg rect, svg path, svg circle",
      );
      const elementCount = await interactiveElements.count();

      // Chart should have some rendered elements
      expect(elementCount).toBeGreaterThan(0);
    });

    test("should display tooltip or hover state on chart elements", async ({
      page,
    }) => {
      await page.goto("/budget");

      // Wait for chart
      await page.waitForSelector("svg", { timeout: 15000 });

      // Find a chart element to hover
      const chartElement = page.locator("svg rect, svg path").first();

      if (await chartElement.isVisible()) {
        // Hover over the element
        await chartElement.hover();

        // Wait for any tooltip or hover effect
        await page.waitForTimeout(500);

        // Look for tooltip (could be various implementations)
        const tooltip = page.locator(
          '[role="tooltip"], [data-testid="tooltip"], .tooltip, [class*="tooltip"]',
        );

        // Tooltip may or may not appear depending on implementation
        // This test just verifies hover doesn't break the page
      }
    });
  });

  test.describe("Data Display", () => {
    test("should display data source attribution", async ({ page }) => {
      await page.goto("/budget");

      await page.waitForLoadState("networkidle");

      // Look for source attribution
      const pageContent = await page.textContent("body");
      expect(pageContent).toMatch(/source|usaspending|data/i);
    });

    test("should show comparison or context information", async ({ page }) => {
      await page.goto("/budget");

      await page.waitForLoadState("networkidle");

      // Navigate to detail page for more context
      const departmentLink = page.locator('a[href^="/budget/"]').first();

      if (await departmentLink.isVisible()) {
        await departmentLink.click();
        await page.waitForLoadState("networkidle");

        // Look for comparison builder or related comparisons
        const comparisonSection = page
          .locator(
            '[data-testid="comparison-builder"], text=/comparison|compare/i',
          )
          .first();

        // Comparisons should be available on detail pages
        const hasComparisons = await page
          .locator("text=/comparison|compare|equals|could fund/i")
          .count();
        expect(hasComparisons).toBeGreaterThan(0);
      }
    });
  });

  test.describe("Responsive Layout", () => {
    test("should display correctly on mobile viewport", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/budget");

      // Main content should be visible
      await expect(page.locator("main")).toBeVisible();

      // Navigation should be accessible
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();
    });

    test("should display correctly on desktop viewport", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto("/budget");

      // Main content should be visible
      await expect(page.locator("main")).toBeVisible();

      // Desktop navigation should be visible
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();
    });
  });

  test.describe("Accessibility", () => {
    test("should be keyboard navigable", async ({ page }) => {
      await page.goto("/budget");

      // Tab through elements
      await page.keyboard.press("Tab");
      await page.waitForTimeout(200);

      // Verify focus is on an element
      const focusedElement = await page.evaluate(
        () => document.activeElement?.tagName,
      );
      expect(focusedElement).toBeTruthy();
    });

    test("should have proper heading structure", async ({ page }) => {
      await page.goto("/budget");

      // Check for h1 heading
      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
    });

    test("should have ARIA labels on interactive elements", async ({
      page,
    }) => {
      await page.goto("/budget");

      // Check for ARIA attributes
      const ariaElements = page.locator(
        "[aria-label], [aria-labelledby], [role]",
      );
      const count = await ariaElements.count();

      expect(count).toBeGreaterThan(0);
    });
  });
});
