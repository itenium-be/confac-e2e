import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  // 🧠 Custom setup/teardown that start Mongo + backend/frontend
  globalSetup: require.resolve("./test-setup/setup.ts"),
  globalTeardown: require.resolve("./test-setup/teardown.ts"),

  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    // 🧱 This project logs in and generates the auth state
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
      use: {
        storageState: undefined, // critical — don’t preload missing file
      },
    },

    // ✅ Dependent test projects
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
});
