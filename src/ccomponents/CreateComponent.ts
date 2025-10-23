import { Locator, Page } from 'playwright';
import { BasePage } from '../pages/BasePage';

export class Createcomponent {

    readonly createOtherButton: Locator;
    readonly createConsultantButton: Locator; 
    protected page: Page; 

    constructor(page: Page) {
        this.page = page;
        this.createOtherButton = page.getByRole("button", { name: "Other creations" });
        this.createConsultantButton = page.getByRole("button", { name: "Create" });
    }

    async clickCreateNewConsultant() : Promise<void> {
    
        await this.createOtherButton.click();
        await this.createConsultantButton.click();
    
    }

}

