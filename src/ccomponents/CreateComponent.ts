import { Locator, Page } from 'playwright';
import { BasePage } from '../pages/BasePage';

export class CreateComponent {

    readonly createOtherButton: Locator;
    readonly createConsultantButton: Locator; 
    protected page: Page; 

    constructor(page: Page) {
        this.page = page;
        this.createOtherButton = page.getByRole("button", { name: "Other creations" });
        this.createConsultantButton = page.getByRole('link', { name: 'Nieuwe consultant' })
    }

    async clickCreateNewConsultant() : Promise<void> {
        await this.createOtherButton.click();
        await this.createConsultantButton.click();
    
    }

}

