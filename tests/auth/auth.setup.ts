import test, { test as setup, expect, request } from "@playwright/test";
import path from "path";

import { LoginPage } from "../../src/pages/LoginPage";

const authFile = path.join(__dirname, "../../playwright/.auth/user.json");
let login: LoginPage;

setup("authenticate", async ({ page }) => {
  const api = await request.newContext({ storageState: authFile });
  const response = await api.get(process.env.BASE_URL_API + "/api/config/security");

  if (response.status() === 200) {
     return
  }
  login = new LoginPage(page);

  await login.goto();
  await login.enterName("e2e-test-user");
  await login.submitForm();

  await expect(page).toHaveTitle("Maandelijkse facturatie - confac");

  await page.context().storageState({ path: authFile });
});
