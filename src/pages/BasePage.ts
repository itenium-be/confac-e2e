import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
    protected page: Page;  
    private _baseURL: string;
   
    protected get baseURL(): string {
        return this._baseURL;
    }


    constructor(page: Page, URL: string) {
        this.page = page;
        this._baseURL = process.env.BASE_URL + URL;
    }

    async goto(url: string = ''): Promise<void> {
        await this.page.goto(this.baseURL) + url;
    }
}