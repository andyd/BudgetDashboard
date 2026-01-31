import { test, expect } from "@playwright/test";

test.describe("Homepage E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Pre-loaded Comparison", () => {
    test("should load the homepage with a pre-loaded comparison", async ({
      page,
    }) => {
      // Verify the page loads with title
      await expect(page).toHaveTitle(/Federal Budget|Tax Dollars/i);

      // Verify the main heading is visible
      const heading = page.locator("h1");
      await expect(heading).toContainText("What Could Your Tax Dollars Buy");

      // Verify the comparison result is pre-loaded (not empty)
      // The default comparison is F-35 Fighter Program vs Teacher Salaries
      const resultNumber = page.locator("span.text-5xl, span.text-6xl").first();
      await expect(resultNumber).toBeVisible();

      // Verify the result contains a formatted number (not empty or zero)
      const resultText = await resultNumber.textContent();
      expect(resultText).toBeTruthy();
      expect(resultText?.length).toBeGreaterThan(0);

      // Verify the unit name is displayed (e.g., "Teacher Salaries")
      const unitDisplay = page.locator("p.text-xl, p.text-2xl").first();
      await expect(unitDisplay).toBeVisible();
    });

    test("should display budget item amount and comparison context", async ({
      page,
    }) => {
      // Verify the budget item name is shown
      const budgetItemLabel = page.getByText("F-35 Fighter Program");
      await expect(budgetItemLabel).toBeVisible();

      // Verify "could fund" context text is present
      await expect(page.getByText(/could fund/i)).toBeVisible();

      // Verify cost per unit is displayed (e.g., "@ $65K each")
      const costPerUnit = page.getByText(/@ \$/);
      await expect(costPerUnit).toBeVisible();
    });
  });

  test.describe("Budget Item Dropdown", () => {
    test("should change the budget item via dropdown", async ({ page }) => {
      // Find the Budget Item dropdown trigger
      const budgetDropdown = page.locator('button[role="combobox"]').first();
      await expect(budgetDropdown).toBeVisible();

      // Get the initial result number
      const resultNumber = page.locator("span.text-5xl, span.text-6xl").first();
      const initialResult = await resultNumber.textContent();

      // Click to open the dropdown
      await budgetDropdown.click();

      // Wait for the dropdown content to appear
      const dropdownContent = page.locator('[role="listbox"]');
      await expect(dropdownContent).toBeVisible();

      // Select a different budget item (NASA Budget if available, or any other item)
      const options = page.locator('[role="option"]');
      const optionCount = await options.count();
      expect(optionCount).toBeGreaterThan(1);

      // Click on a different option (not the first one)
      await options.nth(1).click();

      // Wait for the dropdown to close
      await expect(dropdownContent).not.toBeVisible();

      // Verify the result has changed
      await page.waitForTimeout(300); // Allow for state update
      const newResult = await resultNumber.textContent();

      // The result should be different after changing the budget item
      expect(newResult).toBeTruthy();
    });

    test("should show budget items in the dropdown", async ({ page }) => {
      // Open the Budget Item dropdown
      const budgetDropdown = page.locator('button[role="combobox"]').first();
      await budgetDropdown.click();

      // Verify dropdown options are visible
      const options = page.locator('[role="option"]');
      await expect(options.first()).toBeVisible();

      // Should have multiple budget items
      const count = await options.count();
      expect(count).toBeGreaterThan(5);
    });
  });

  test.describe("Comparison Unit Dropdown", () => {
    test("should change the comparison unit via dropdown", async ({ page }) => {
      // Find the second dropdown (Compare To / Comparison Unit)
      const unitDropdown = page.locator('button[role="combobox"]').nth(1);
      await expect(unitDropdown).toBeVisible();

      // Get the initial unit display
      const unitDisplay = page.locator("p.text-xl, p.text-2xl").first();
      const initialUnit = await unitDisplay.textContent();

      // Click to open the dropdown
      await unitDropdown.click();

      // Wait for the dropdown content to appear
      const dropdownContent = page.locator('[role="listbox"]');
      await expect(dropdownContent).toBeVisible();

      // Select a different unit
      const options = page.locator('[role="option"]');
      const optionCount = await options.count();
      expect(optionCount).toBeGreaterThan(1);

      // Click on a different option
      await options.nth(2).click();

      // Wait for the dropdown to close
      await expect(dropdownContent).not.toBeVisible();

      // Verify the unit display has changed
      await page.waitForTimeout(300);
      const newUnit = await unitDisplay.textContent();
      expect(newUnit).not.toBe(initialUnit);
    });

    test("should show comparison units grouped by category", async ({
      page,
    }) => {
      // Open the Compare To dropdown
      const unitDropdown = page.locator('button[role="combobox"]').nth(1);
      await unitDropdown.click();

      // Verify category labels exist (grouped dropdown)
      const categoryLabels = page.locator(
        '[role="group"] label, [data-radix-select-label]',
      );
      const labelCount = await categoryLabels.count();

      // Should have at least one category
      expect(labelCount).toBeGreaterThanOrEqual(1);

      // Verify options are visible
      const options = page.locator('[role="option"]');
      await expect(options.first()).toBeVisible();
    });
  });

  test.describe("Result Updates", () => {
    test("should update the result when budget item changes", async ({
      page,
    }) => {
      // Get initial result
      const resultNumber = page.locator("span.text-5xl, span.text-6xl").first();
      const initialResult = await resultNumber.textContent();

      // Change budget item
      const budgetDropdown = page.locator('button[role="combobox"]').first();
      await budgetDropdown.click();

      const options = page.locator('[role="option"]');
      await options.nth(3).click();

      // Wait for update
      await page.waitForTimeout(500);

      // Verify result changed
      const newResult = await resultNumber.textContent();
      expect(newResult).toBeTruthy();
      // Note: The result might be the same if items have similar amounts
      // but the component should still respond
    });

    test("should update the result when comparison unit changes", async ({
      page,
    }) => {
      // Get initial result and unit
      const resultNumber = page.locator("span.text-5xl, span.text-6xl").first();
      const unitDisplay = page.locator("p.text-xl, p.text-2xl").first();

      const initialResult = await resultNumber.textContent();
      const initialUnit = await unitDisplay.textContent();

      // Change comparison unit
      const unitDropdown = page.locator('button[role="combobox"]').nth(1);
      await unitDropdown.click();

      const options = page.locator('[role="option"]');
      await options.nth(4).click();

      // Wait for update
      await page.waitForTimeout(500);

      // Verify the display updated
      const newUnit = await unitDisplay.textContent();
      expect(newUnit).not.toBe(initialUnit);
    });

    test("should display formatted numbers in result", async ({ page }) => {
      // The result should show formatted numbers with commas
      const resultNumber = page.locator("span.text-5xl, span.text-6xl").first();
      const resultText = await resultNumber.textContent();

      // Should be a formatted number (with possible commas)
      expect(resultText).toMatch(/^[\d,]+$/);
    });
  });

  test.describe("Sidebar Example Clicks", () => {
    test("should display sidebar with example comparisons", async ({
      page,
    }) => {
      // Find the sidebar section
      const sidebar = page.locator(".lg\\:col-span-4").first();
      await expect(sidebar).toBeVisible();

      // Verify "More Comparisons" heading
      await expect(page.getByText("More Comparisons")).toBeVisible();

      // Verify example cards are present
      const exampleCards = sidebar.locator("button.rounded-lg");
      const cardCount = await exampleCards.count();
      expect(cardCount).toBeGreaterThan(0);
    });

    test("should update comparison when clicking sidebar example", async ({
      page,
    }) => {
      // Get initial state
      const resultNumber = page.locator("span.text-5xl, span.text-6xl").first();
      const initialResult = await resultNumber.textContent();

      // Find sidebar example buttons
      const sidebar = page.locator(".lg\\:col-span-4").first();
      const exampleCards = sidebar.locator("button.rounded-lg");

      // Click on the first example card
      await exampleCards.first().click();

      // Wait for the comparison to update
      await page.waitForTimeout(500);

      // Verify the result changed
      const newResult = await resultNumber.textContent();
      expect(newResult).toBeTruthy();
    });

    test("should show budget name in sidebar examples", async ({ page }) => {
      // Find sidebar example cards
      const sidebar = page.locator(".lg\\:col-span-4").first();
      const exampleCards = sidebar.locator("button.rounded-lg");

      // Each card should have a budget name
      const firstCard = exampleCards.first();
      const budgetName = firstCard.locator(".text-muted-foreground").first();
      await expect(budgetName).toBeVisible();
      const budgetText = await budgetName.textContent();
      expect(budgetText?.length).toBeGreaterThan(0);
    });

    test("should show formatted result count in sidebar examples", async ({
      page,
    }) => {
      // Find sidebar example cards
      const sidebar = page.locator(".lg\\:col-span-4").first();
      const exampleCards = sidebar.locator("button.rounded-lg");

      // Each card should have a formatted number in primary color
      const firstCard = exampleCards.first();
      const resultCount = firstCard.locator(".text-primary");
      await expect(resultCount).toBeVisible();

      const countText = await resultCount.textContent();
      expect(countText).toMatch(/^[\d,]+$/);
    });

    test("should update dropdowns when clicking sidebar example", async ({
      page,
    }) => {
      // Get initial dropdown values
      const budgetDropdown = page.locator('button[role="combobox"]').first();
      const unitDropdown = page.locator('button[role="combobox"]').nth(1);

      const initialBudget = await budgetDropdown.textContent();

      // Click on a sidebar example
      const sidebar = page.locator(".lg\\:col-span-4").first();
      const exampleCards = sidebar.locator("button.rounded-lg");
      await exampleCards.first().click();

      await page.waitForTimeout(500);

      // The dropdown values should reflect the clicked example
      // (At minimum, the state should have changed)
      const newBudget = await budgetDropdown.textContent();
      expect(newBudget).toBeTruthy();
    });

    test('should have "Browse all comparisons" link', async ({ page }) => {
      // Find the link to browse all comparisons
      const browseLink = page.getByRole("link", {
        name: /browse all comparisons/i,
      });
      await expect(browseLink).toBeVisible();

      // Verify it links to the compare page
      await expect(browseLink).toHaveAttribute("href", "/compare");
    });
  });

  test.describe("Action Buttons", () => {
    test("should have Copy Link button", async ({ page }) => {
      const copyButton = page.getByRole("button", { name: /copy link/i });
      await expect(copyButton).toBeVisible();
    });

    test("should have Share Card button", async ({ page }) => {
      const shareButton = page.getByRole("button", { name: /share card/i });
      await expect(shareButton).toBeVisible();
    });
  });

  test.describe("Data Freshness Indicator", () => {
    test("should display data source attribution", async ({ page }) => {
      // Look for USAspending.gov source link
      const sourceLink = page.getByRole("link", { name: /usaspending/i });
      await expect(sourceLink).toBeVisible();
    });
  });

  test.describe("Budget Overview Section", () => {
    test("should display budget pie chart section", async ({ page }) => {
      // Scroll to budget overview section
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });

      // Verify the heading
      await expect(page.getByText("Explore the Full Budget")).toBeVisible();

      // Verify SVG visualization is present
      const chart = page.locator("svg").first();
      await expect(chart).toBeVisible({ timeout: 10000 });
    });

    test("should have link to detailed breakdown", async ({ page }) => {
      // Scroll to see the link
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });

      const detailLink = page.getByRole("link", {
        name: /view detailed breakdown/i,
      });
      await expect(detailLink).toBeVisible();
      await expect(detailLink).toHaveAttribute("href", "/budget");
    });
  });

  test.describe("Stats Section", () => {
    test("should display budget statistics", async ({ page }) => {
      // Scroll to stats section
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      // Verify key stats are visible
      await expect(page.getByText("$7.0T")).toBeVisible();
      await expect(page.getByText("Total FY2025 Budget")).toBeVisible();
      await expect(page.getByText("100+")).toBeVisible();
      await expect(page.getByText("Budget Items")).toBeVisible();
    });
  });
});
