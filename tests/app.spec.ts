import { test, expect } from '@playwright/test';

test.describe('WebApp Template', () => {
  test('should load the home page successfully', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check that the page loads
    await expect(page).toHaveTitle(/WebApp/);

    // Check for main navigation
    await expect(page.locator('nav')).toBeVisible();

    // Check for hero section
    await expect(page.locator('h1')).toContainText('Build Something');

    // Check for theme toggle (using the actual button)
    await expect(
      page.locator('button[aria-label="Toggle theme"]')
    ).toBeVisible();
  });

  test('should navigate to About page', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Click on About link in desktop navigation
    await page.click('nav a[href="/about"]');

    // Check that we're on the About page
    await expect(page).toHaveURL('http://localhost:3000/about');
    await expect(page.locator('h1')).toContainText('Empowering Developers');
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Click on Contact link in desktop navigation
    await page.click('nav a[href="/contact"]');

    // Check that we're on the Contact page
    await expect(page).toHaveURL('http://localhost:3000/contact');
    await expect(page.locator('h1')).toContainText('Build Something');
  });

  test('should show 404 page for invalid routes', async ({ page }) => {
    await page.goto('http://localhost:3000/nonexistent-page');

    // Check that we get a 404 page
    await expect(page.locator('h1')).toContainText('404');
    await expect(page.locator('h2')).toContainText('Page Not Found');
  });

  test('should have working navigation menu on desktop', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Check that navigation links are present
    await expect(page.locator('nav a[href="/"]').first()).toBeVisible();
    await expect(page.locator('nav a[href="/about"]')).toBeVisible();
    await expect(page.locator('nav a[href="/contact"]')).toBeVisible();
  });

  test('should have mobile navigation menu', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that mobile menu button is visible
    await expect(
      page.locator('button[aria-label="Toggle menu"]')
    ).toBeVisible();

    // Click mobile menu button
    await page.click('button[aria-label="Toggle menu"]');

    // Check that mobile menu is open
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('nav')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should have all landing page sections', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check for all main sections
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#features')).toBeVisible();
    await expect(page.locator('#how-it-works')).toBeVisible();
    await expect(page.locator('#testimonials')).toBeVisible();
    await expect(page.locator('#pricing')).toBeVisible();
    await expect(page.locator('#faq')).toBeVisible();
    await expect(page.locator('#cta')).toBeVisible();
  });

  test('should have working theme toggle', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Find and click theme toggle
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();

    // Check that theme toggle is still visible after click
    await expect(themeToggle).toBeVisible();
  });
});
