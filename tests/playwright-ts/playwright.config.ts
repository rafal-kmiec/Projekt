import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.DEMO_APP_BASE_URL ?? "http://localhost:5173";
const junitOutputFile =
  process.env.PLAYWRIGHT_JUNIT_OUTPUT_FILE ?? "../../reports/playwright-results.xml";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["junit", { outputFile: junitOutputFile }],
    ["list"]
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
