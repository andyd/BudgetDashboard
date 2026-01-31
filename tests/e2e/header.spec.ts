import { test, expect } from "@playwright/test";

test("header has no visible background", async ({ page }) => {
  await page.goto("/");

  // Target the navigation header specifically (the sticky one with backdrop-blur)
  const navHeader = page.getByRole("banner");

  const headerBg = await navHeader.evaluate(
    (el) => getComputedStyle(el).backgroundColor,
  );
  const bodyBg = await page
    .locator("body")
    .evaluate((el) => getComputedStyle(el).backgroundColor);

  console.log("Header background:", headerBg);
  console.log("Body background:", bodyBg);

  // Check if header background is transparent or matches body
  const isTransparent =
    headerBg === "rgba(0, 0, 0, 0)" || headerBg === "transparent";
  const matchesBody = headerBg === bodyBg;

  expect(isTransparent || matchesBody).toBeTruthy();
});
