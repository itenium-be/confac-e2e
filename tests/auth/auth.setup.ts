import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../../src/pages/LoginPage';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');
let login: LoginPage;


setup('authenticate', async ({ page }) => {
    login = new LoginPage(page);
   
    await login.goto();
    await login.enterName('e2e-test-user');
    await login.submitForm();

    await expect(page).toHaveTitle("Maandelijkse facturatie - confac")
   
    await page.context().storageState({ path: authFile });

})