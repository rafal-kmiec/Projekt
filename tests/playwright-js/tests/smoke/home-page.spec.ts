import { test } from "@playwright/test";

import { HomePage } from "../../src/pages/home-page";

test("home page loads", async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.goto();
  await homePage.expectLoaded();
});
