import { defineConfig } from "@playwright/test";

const executablePath = process.env.PW_CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

export default defineConfig({
  testDir: "tests/e2e",
  outputDir: "test-results",
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3100",
    launchOptions: { executablePath },
  },
  projects: [
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : { command: "npm run start -- -p 3100", url: "http://localhost:3100", reuseExistingServer: true, timeout: 60_000 },
});
