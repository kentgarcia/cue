import { defineConfig, devices } from "@playwright/test";

const production = process.env.CUE_PRODUCTION === "1";
const port = production ? 4173 : 5173;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: production ? "npm run preview -- --port 4173" : "npm run dev -- --port 5173",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
