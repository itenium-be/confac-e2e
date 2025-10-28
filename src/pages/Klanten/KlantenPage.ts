import { Locator, Page } from "playwright";
import { BasePage } from "../BasePage";
import { CreateComponent } from "../../components/CreateComponent";

export class KlantenPage extends BasePage {
  createComponent: CreateComponent;

    nieuweKlantButton: Locator
    zoekenInput: Locator;
    filterdropdown: Locator;
    toonInactieveToggle: Locator;
  constructor(page: Page, url: string = "/clients") {
    super(page, url);
    
    this.createComponent = new CreateComponent(page);
    this.nieuweKlantButton = page.getByTestId("add");
    this.zoekenInput = page.getByRole("textbox", { name: "Zoeken" });
    this.filterdropdown = page.getByTestId("");
    this.toonInactieveToggle = page.locator('div').filter({ hasText: 'Toon inactieve' }).nth(5);
  }

    /**
     * 
     */
    async ClickOnNieuweKlant() {
        await this.nieuweKlantButton.click();
}
}

/*
getByTestId('add')
getByRole('textbox', { name: 'Zoeken' })
locator('div').filter({ hasText: /^2025$/ }).nth(3)
locator('.react-select__indicator')await page.locator('svg').click();
await page.getByText('Onderaannemer').click();
await page.locator('#react-select-2-option-1').click();
locator('div').filter({ hasText: 'Toon inactieve' }).nth(5)
getByRole('cell', { name: 'BE2' })
getByRole('button', { name: '' }).first()
getByRole('button', { name: '' }).first()

//nieuwe klant creation

await page.getByTestId('add').click();
await page.getByTestId('btw').click();
await page.getByTestId('btw').fill('1');
await page.getByTestId('btw-continue').click();
await page.getByTestId('name').click();
await page.getByTestId('name').fill('klant');
await page.locator('div').filter({ hasText: /^Type\(s\)$/ }).nth(2).click();

await page.getByRole('combobox', { name: 'types' }).click();
await page.getByTestId('address').click();
await page.getByTestId('address').fill('straat');
await page.getByTestId('postalCode').click();
await page.getByTestId('postalCode').fill('postcode');
await page.getByTestId('city').click();
await page.getByTestId('city').fill('stad');
await page.locator('.col-lg-3 > .form-group > .css-b62m3t-container > .react-select__control > .react-select__value-container > .react-select__input-container').first().click();
await page.getByText('België').click();


await page.getByTestId('contact').click();
await page.getByTestId('contact').fill('contact');
await page.getByTestId('contactEmail').click();
await page.getByTestId('contactEmail').fill('email contact');
await page.locator('div').filter({ hasText: 'Telefoon nr' }).nth(4).click();
await page.getByTestId('telephone').fill('1');
await page.locator('.col-lg-3 > .form-group > .react-select-base > .react-select__control > .react-select__value-container > .react-select__input-container').click();
await page.getByText('nl').click();

await page.locator('#rdw-wrapper-9356').getByRole('textbox', { name: 'rdw-editor' }).click();
*/