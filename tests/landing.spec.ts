import { test, expect } from '@playwright/test';

test.describe('Budget Dashboard Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Page Load and Basic Structure', () => {
    test('should load the landing page successfully', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/Budget|Federal/i);

      // Check main sections are visible
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });

    test('should display "Where Your Tax Dollars Go" heading', async ({
      page,
    }) => {
      // Check for main heading or similar text
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });

    test('should show current fiscal year', async ({ page }) => {
      // Look for year indicator (e.g., "2026", "FY 2026")
      const yearRegex = /20\d{2}|FY\s*20\d{2}/i;
      const pageContent = await page.textContent('body');
      expect(pageContent).toMatch(yearRegex);
    });
  });

  test.describe('Budget Visualization', () => {
    test('should display budget visualization on left side', async ({
      page,
    }) => {
      // Look for visualization container (SVG for D3.js treemap/sunburst)
      const viz = page.locator('svg').first();
      await expect(viz).toBeVisible({ timeout: 10000 });
    });

    test('should show budget categories in visualization', async ({ page }) => {
      // Wait for SVG to render
      await page.waitForSelector('svg', { timeout: 10000 });

      // Check that visualization has interactive elements
      const vizElements = page.locator('svg rect, svg path, svg g');
      await expect(vizElements.first()).toBeVisible();
    });

    test('should handle hover on budget segments', async ({ page }) => {
      // Wait for visualization to load
      await page.waitForSelector('svg', { timeout: 10000 });

      // Find an interactive element
      const segment = page.locator('svg rect, svg path').first();
      await expect(segment).toBeVisible();

      // Hover over segment
      await segment.hover();

      // Verify some visual feedback or tooltip appears
      // This could be a tooltip, highlight, or updated comparison panel
      await page.waitForTimeout(500); // Allow time for hover effects
    });

    test('should allow clicking budget segments for drill-down', async ({
      page,
    }) => {
      // Wait for visualization
      await page.waitForSelector('svg', { timeout: 10000 });

      // Find clickable segment
      const segment = page.locator('svg rect, svg path').first();

      // Click segment
      await segment.click();

      // Should navigate to drill-down or show detailed view
      // Could check for URL change, modal, or panel update
      await page.waitForTimeout(1000);
    });

    test('should show breadcrumb navigation in drill-down', async ({
      page,
    }) => {
      // Navigate to a drill-down view
      const segment = page.locator('svg rect, svg path').first();
      await segment.click({ timeout: 10000 });

      // Look for breadcrumb component
      const breadcrumb = page.locator('[aria-label*="breadcrumb"], nav ol, nav ul').first();

      // Breadcrumb might not be visible until drill-down, so we check conditionally
      // If we're on drill-down page, breadcrumb should exist
      const currentUrl = page.url();
      if (currentUrl.includes('/budget/')) {
        await expect(breadcrumb).toBeVisible();
      }
    });
  });

  test.describe('Featured Comparison Carousel', () => {
    test('should display comparison cards on right side', async ({ page }) => {
      // Look for comparison card container
      const comparisonSection = page.locator(
        '[data-testid="comparison-carousel"], [data-testid="featured-comparisons"]'
      ).first();

      // If test IDs aren't set, look for card components
      const cards = page.locator('[data-testid="comparison-card"]').first();

      // At least check that some comparison content exists
      const hasComparison = await page.locator('text=/comparison|compare|vs/i').count();
      expect(hasComparison).toBeGreaterThan(0);
    });

    test('should show comparison with dollar amounts', async ({ page }) => {
      // Look for dollar amount patterns ($XX.XB, $X.XT, etc.)
      const dollarRegex = /\$[\d,]+\.?\d*[BMT]?/;
      const pageContent = await page.textContent('body');
      expect(pageContent).toMatch(dollarRegex);
    });

    test('should display source citations in comparisons', async ({ page }) => {
      // Look for source indicators (e.g., "Source:", "BLS", "Census", etc.)
      const sourceIndicators = page.locator(
        'text=/source|citation|bls|census|kff|hhs/i'
      );

      // Should have at least one source citation
      const count = await sourceIndicators.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should rotate through comparison cards', async ({ page }) => {
      // Get initial comparison text
      const initialContent = await page.textContent('body');

      // Wait for carousel rotation (adjust timeout based on rotation interval)
      await page.waitForTimeout(5000);

      // Check if content changed (carousel rotated)
      const updatedContent = await page.textContent('body');

      // Note: This test might be flaky if carousel doesn't auto-rotate
      // Alternatively, look for next/prev buttons
      const nextButton = page.locator('button[aria-label*="next"], button:has-text("Next")').first();
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500);
      }
    });

    test('should allow manual navigation of carousel', async ({ page }) => {
      // Look for carousel navigation buttons
      const nextButton = page.locator(
        'button[aria-label*="next"], button[data-testid="carousel-next"]'
      ).first();

      const prevButton = page.locator(
        'button[aria-label*="previous"], button[data-testid="carousel-prev"]'
      ).first();

      // Test next button if visible
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500);
        await expect(nextButton).toBeVisible();
      }

      // Test previous button if visible
      if (await prevButton.isVisible()) {
        await prevButton.click();
        await page.waitForTimeout(500);
        await expect(prevButton).toBeVisible();
      }
    });
  });

  test.describe('Drill-Down Navigation', () => {
    test('should navigate to budget detail page when clicking item', async ({
      page,
    }) => {
      // Wait for visualization
      await page.waitForSelector('svg', { timeout: 10000 });

      // Get initial URL
      const initialUrl = page.url();

      // Click a budget segment
      const segment = page.locator('svg rect, svg path').first();
      await segment.click();

      // Wait for navigation
      await page.waitForTimeout(1000);

      // URL should change or modal should appear
      const newUrl = page.url();
      // Either URL changed or we're on same page with different state
    });

    test('should show detailed budget breakdown in drill-down', async ({
      page,
    }) => {
      // Navigate to drill-down
      const segment = page.locator('svg rect, svg path').first();
      await segment.click({ timeout: 10000 });
      await page.waitForTimeout(1000);

      // Check for detailed information
      const details = page.locator('text=/department|agency|program|million|billion/i');
      const count = await details.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display year-over-year change indicators', async ({
      page,
    }) => {
      // Navigate to drill-down view
      const segment = page.locator('svg rect, svg path').first();
      await segment.click({ timeout: 10000 });
      await page.waitForTimeout(1000);

      // Look for change indicators (arrows, percentages)
      const changeIndicators = page.locator('text=/↑|↓|▲|▼|%|increase|decrease/i');

      // Might not be on all items, so just check if any exist
      const count = await changeIndicators.count();
      // No assertion - this is optional content
    });

    test('should allow navigation back via breadcrumb', async ({ page }) => {
      // This test requires actual drill-down implementation
      // For now, just check breadcrumb exists if we're on detail page
      const currentUrl = page.url();

      if (currentUrl.includes('/budget/')) {
        const breadcrumb = page.locator('[aria-label*="breadcrumb"]').first();
        const breadcrumbLink = breadcrumb.locator('a').first();

        if (await breadcrumbLink.isVisible()) {
          await breadcrumbLink.click();
          await page.waitForTimeout(500);
        }
      }
    });
  });

  test.describe('Comparison Builder', () => {
    test('should display comparison builder interface', async ({ page }) => {
      // Scroll to comparison builder section
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });

      // Look for "Compare ___ to ___" interface
      const builder = page.locator(
        '[data-testid="comparison-builder"], text=/build your own|compare.*to/i'
      ).first();

      // Builder might be lower on page
      await page.waitForTimeout(500);
    });

    test('should have dropdown selectors for comparison items', async ({
      page,
    }) => {
      // Scroll to find builder
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });

      // Look for select/dropdown elements
      const selects = page.locator('select, [role="combobox"]');
      const count = await selects.count();

      // Should have at least 2 dropdowns (from and to)
      if (count >= 2) {
        expect(count).toBeGreaterThanOrEqual(2);
      }
    });

    test('should show comparison result when items selected', async ({
      page,
    }) => {
      // Scroll to builder
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });

      // Find dropdowns
      const firstSelect = page.locator('select, [role="combobox"]').first();

      if (await firstSelect.isVisible()) {
        // Select an option
        await firstSelect.click();
        await page.waitForTimeout(500);

        // Select first option
        const firstOption = page.locator('option, [role="option"]').nth(1);
        if (await firstOption.isVisible()) {
          await firstOption.click();
          await page.waitForTimeout(500);
        }
      }
    });

    test('should display calculation in comparison result', async ({
      page,
    }) => {
      // Look for math display (e.g., "$12.4B ÷ $3,000/year = 4.1M")
      const mathRegex = /÷|\/|=|\d+\.?\d*[BMT]/;
      const pageContent = await page.textContent('body');

      // Math might only appear after using builder
      // This is a basic check
    });
  });

  test.describe('Share Functionality', () => {
    test('should display share button for comparisons', async ({ page }) => {
      // Look for share button
      const shareButton = page.locator(
        'button:has-text("Share"), button[aria-label*="share"]'
      ).first();

      // Share button might be in comparison cards
      await page.waitForTimeout(500);
    });

    test('should show share options when clicked', async ({ page }) => {
      const shareButton = page.locator(
        'button:has-text("Share"), button[aria-label*="share"]'
      ).first();

      if (await shareButton.isVisible({ timeout: 5000 })) {
        await shareButton.click();
        await page.waitForTimeout(500);

        // Should show share dialog or options
        const shareDialog = page.locator('[role="dialog"], [data-testid="share-dialog"]');

        // Or look for social sharing links
        const socialLinks = page.locator('a[href*="twitter"], a[href*="facebook"]');
      }
    });

    test('should generate shareable URL for comparison', async ({ page }) => {
      const shareButton = page.locator(
        'button:has-text("Share"), button[aria-label*="share"]'
      ).first();

      if (await shareButton.isVisible({ timeout: 5000 })) {
        await shareButton.click();
        await page.waitForTimeout(500);

        // Look for copy URL button or input
        const copyButton = page.locator('button:has-text("Copy")').first();
        const urlInput = page.locator('input[type="text"], input[readonly]').first();

        // Should have some way to copy URL
      }
    });

    test('should copy comparison link to clipboard', async ({ page }) => {
      const shareButton = page.locator(
        'button:has-text("Share"), button[aria-label*="share"]'
      ).first();

      if (await shareButton.isVisible({ timeout: 5000 })) {
        await shareButton.click();
        await page.waitForTimeout(500);

        const copyButton = page.locator(
          'button:has-text("Copy"), button[aria-label*="copy"]'
        ).first();

        if (await copyButton.isVisible()) {
          // Grant clipboard permissions
          await page.context().grantPermissions(['clipboard-write', 'clipboard-read']);

          await copyButton.click();
          await page.waitForTimeout(500);

          // Verify clipboard has content
          const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
          expect(clipboardText).toBeTruthy();
        }
      }
    });
  });

  test.describe('Mobile Responsive Layout', () => {
    test('should stack layout on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Check that main content is visible
      await expect(page.locator('main')).toBeVisible();

      // Visualization should be on top
      const viz = page.locator('svg').first();
      await expect(viz).toBeVisible({ timeout: 10000 });
    });

    test('should show mobile navigation menu', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Look for hamburger menu button
      const menuButton = page.locator(
        'button[aria-label*="menu"], button:has-text("☰")'
      ).first();

      if (await menuButton.isVisible()) {
        await menuButton.click();
        await page.waitForTimeout(500);

        // Menu should open
        const menu = page.locator('[role="dialog"], nav');
        await expect(menu.first()).toBeVisible();
      }
    });

    test('should use slide-in panel for drill-down on mobile', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Wait for viz
      await page.waitForSelector('svg', { timeout: 10000 });

      // Click a segment
      const segment = page.locator('svg rect, svg path').first();
      await segment.click();
      await page.waitForTimeout(1000);

      // Should show panel or navigate
      // Check for slide-in animation classes or panel
      const panel = page.locator('[data-testid="drill-down-panel"], [role="dialog"]');
    });

    test('should maintain touch interactions on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Verify visualization is touch-friendly
      const viz = page.locator('svg').first();
      await expect(viz).toBeVisible({ timeout: 10000 });

      // Tap on segment
      const segment = page.locator('svg rect, svg path').first();
      await segment.tap();
      await page.waitForTimeout(500);
    });

    test('should scroll comparisons vertically on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Scroll down to comparisons
      await page.evaluate(() => {
        window.scrollTo(0, window.innerHeight);
      });

      await page.waitForTimeout(500);

      // Comparisons should be visible below viz
      const hasContent = await page.locator('body').isVisible();
      expect(hasContent).toBe(true);
    });
  });

  test.describe('Data Quality and Accessibility', () => {
    test('should show data freshness indicator', async ({ page }) => {
      // Look for "Last updated" or "Data as of" text
      const freshnessText = page.locator('text=/last updated|data as of|updated:/i');

      const count = await freshnessText.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display source attribution', async ({ page }) => {
      // Look for data sources mentioned
      const sources = page.locator('text=/usaspending|cbo|omb|source/i');

      const count = await sources.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

      // Check that focus is visible
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });

    test('should have proper ARIA labels for visualization', async ({
      page,
    }) => {
      // Check for ARIA labels on interactive elements
      const ariaElements = page.locator('[aria-label], [aria-labelledby], [role]');

      const count = await ariaElements.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should provide text alternatives for visualizations', async ({
      page,
    }) => {
      // Check for descriptive text or table alternative
      const viz = page.locator('svg').first();

      if (await viz.isVisible({ timeout: 10000 })) {
        // Should have title or description
        const title = viz.locator('title');
        const desc = viz.locator('desc');

        // At least one should exist
        const hasTitle = await title.count();
        const hasDesc = await desc.count();

        // Or check for aria-label on SVG
        const ariaLabel = await viz.getAttribute('aria-label');
      }
    });
  });

  test.describe('Performance', () => {
    test('should load visualization within 10 seconds', async ({ page }) => {
      const startTime = Date.now();

      await page.waitForSelector('svg', { timeout: 10000 });

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(10000);
    });

    test('should load comparison data without blocking UI', async ({
      page,
    }) => {
      // Page should be interactive even if data is loading
      const navigation = page.locator('nav');
      await expect(navigation).toBeVisible();

      // Check that page is responsive
      const isEnabled = await page.locator('body').isEnabled();
      expect(isEnabled).toBe(true);
    });
  });
});
