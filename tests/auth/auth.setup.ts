import test, { test as setup, expect } from '@playwright/test';
import path from 'path';

import { setupTestEnvironment, teardownTestEnvironment } from '../../test-setup/setup';
import { LoginPage } from '../../src/pages/loginPage';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');
let login: LoginPage;

test.beforeAll(async () => {
  await setupTestEnvironment();
});

test.afterAll(async () => {
  await teardownTestEnvironment();
});

setup('authenticate', async ({ page }) => {
    login = new LoginPage(page);
   
    await login.goto();
    await login.enterName('e2e-test-user');
    await login.submitForm();

    await expect(page).toHaveTitle("Maandelijkse facturatie - confac")
   
    await page.context().storageState({ path: authFile });

})