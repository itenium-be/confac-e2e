import { test, expect } from "@playwright/test";
import { LoginPage } from "../src/pages/LoginPage";


let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
});

test("hello world", async ({ page }) => {
  console.log("hello world");
  expect(true).toBeTruthy();

  await loginPage.goto();
});
