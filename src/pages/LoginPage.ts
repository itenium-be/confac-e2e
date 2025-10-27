import { Locator, Page } from 'playwright';
import { BasePage } from './BasePage';


export class LoginPage extends BasePage {

    readonly nameInput: Locator;
    readonly submit: Locator;
    
    constructor(page: Page, url: string = '/login') {
        super(page, url);

        this.nameInput =  page.getByTestId('name');
        this.submit = page.getByText('Confac Starten');
        }

        get url() {
           return this.baseURL
        }
        async goto() {
            await super.goto();
        }
        async enterName(name: string): Promise<void> {
            await this.nameInput.fill(name);}
        async submitForm(): Promise<void> {
            await this.submit.click();
        }
    }
            