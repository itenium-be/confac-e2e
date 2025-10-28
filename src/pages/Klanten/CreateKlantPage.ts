import { Locator, Page } from "playwright";
import { BasePage } from "../BasePage";
import { CreateComponent } from "../../components/CreateComponent";
import { klantTypes } from "../../enum/klantTypes";

export class CreateKlantPage extends BasePage {
  createComponent: CreateComponent;

  btwNummerInput: Locator;
  klantVerderAanvullenButton: Locator;

  raamcontractDropdown: Locator;
  klantInput: Locator;
  btwInput: Locator;
  typeDropdown: Locator;
  typeDropdownOptions: Locator;
  straatEnNummerInput: Locator;
  PostcodeInput: Locator;
  stadInput: Locator;
  landDropdown: Locator;
  landDropdownOptions: Locator;
  contactGegevensInput: Locator;
  contactEmailInput: Locator;
  telefoonNrInput: Locator;
  taalDropdown: Locator;
  bewarenButton: Locator;

  constructor(page: Page, url: string = "/clients/create") {
    super(page, url);

    this.createComponent = new CreateComponent(page);
    this.btwNummerInput = page.getByTestId("btw");
    this.klantVerderAanvullenButton = page.getByTestId("btw-continue");

    this.raamcontractDropdown = page
      .locator("div")
      .filter({ hasText: /^Type\(s\)$/ })
      .nth(2);
    this.klantInput = page.getByTestId("name");
    this.btwInput = page.getByTestId("btw");
    this.typeDropdown = page.locator('.react-select__value-container.react-select__value-container--is-multi > .react-select__input-container').first()
    this.typeDropdownOptions = page.locator("#react-select-4-listbox")
    this.straatEnNummerInput = page.getByTestId("address");
    this.PostcodeInput = page.getByTestId("postalCode");
    this.stadInput = page.getByTestId("city");
    this.landDropdown = page
      .locator(
        ".col-lg-3 > .form-group > .css-b62m3t-container > .react-select__control > .react-select__value-container > .react-select__input-container"
      )
      .first();
          this.landDropdownOptions = page.locator("#react-select-5-listbox")

    this.contactGegevensInput = page.getByTestId("contact");
    this.contactEmailInput = page.getByTestId("contactEmail");
    this.telefoonNrInput = page
      .locator("div")
      .filter({ hasText: "Telefoon nr" })
      .nth(4);
    this.taalDropdown = page.locator(
      ".col-lg-3 > .form-group > .react-select-base > .react-select__control > .react-select__value-container > .react-select__input-container"
    );
    this.bewarenButton = page.getByRole("button", { name: "Bewaren" });
  }

  /**
   *
   * @param btwNummer
   * @returns
   */
  async btwNummerInvullen(btwNummer: string) {
    await this.btwNummerInput.fill(btwNummer);
  }
  /**
   *
   * @returns
   */
  async ClickKlantVerderAanvullen() {
    await this.klantVerderAanvullenButton.click();
  }
  /** */
  async klantNaamInvullen(klantNaam: string) {
    await this.klantInput.fill(klantNaam);
  }

  /**
   *
   * @param btw
   * @returns
   */
  async btwInvullen(btw: string) {
    await this.btwInput.fill(btw);

    return this;
  }

  /**
   *
   * @param type
   * @returns
   */
  async typeDropdownSelecteren(type: klantTypes) {
    await this.typeDropdown.click();
    await this.typeDropdownOptions.locator('.react-select__option', { hasText: type }).click();
  }


  /**
   *
   * @param straatEnNummer
   * @returns
   */
  async straatEnNummerInvullen(straatEnNummer: string) {
    await this.straatEnNummerInput.fill(straatEnNummer);

  }
  /**
   *
   * @param postcode
   * @returns
   */
  async postcodeInvullen(postcode: string) {
    await this.PostcodeInput.fill(postcode);

    return this;
  }
  /**
   *
   * @param stad
   * @returns
   */
  async stadInvullen(stad: string) {
    await this.stadInput.fill(stad);

    return this;
  }

  /**
   *
   * @param land
   * @returns
   */
  async landDropdownSelecteren(land: string) {
    await this.landDropdown.click();
    await this.landDropdownOptions.locator('.react-select__option', { hasText: land }).click();

    return this;
  }

  /**
   *
   * @param contactGegevens
   * @returns
   */
  async contactGegevensInvullen(contactGegevens: string) {
    await this.contactGegevensInput.fill(contactGegevens);

    return this;
  }

  /**
   *
   * @param contactEmail
   * @returns
   */
  async contactEmailInvullen(contactEmail: string) {
    await this.contactEmailInput.fill(contactEmail);

    return this;
  }
  /**
   *
   * @param telefoonNr
   * @returns
   */
  async telefoonNrInvullen(telefoonNr: string) {
    await this.telefoonNrInput.fill(telefoonNr);

    return this;
  }
  /**
   *
   * @param taal
   * @returns
   */
  async taalDropdownSelecteren(taal: string) {
    await this.taalDropdown.click();
    await this.page.getByText(taal).click();

    return this;
  }

  async clickBewaren() {
    await this.bewarenButton.click();

    return this;
  }
}

/*
await page.getByTestId("add").click();
await page.getByTestId("btw").click();
await page.getByTestId("btw").fill("1");
await page.getByTestId("btw-continue").click();
await page.getByTestId("name").click();
await page.getByTestId("name").fill("klant");
await page
  .locator("div")
  .filter({ hasText: /^Type\(s\)$/ })
  .nth(2)
  .click();

await page.getByRole("combobox", { name: "types" }).click();
await page.getByTestId("address").click();
await page.getByTestId("address").fill("straat");
await page.getByTestId("postalCode").click();
await page.getByTestId("postalCode").fill("postcode");
await page.getByTestId("city").click();
await page.getByTestId("city").fill("stad");
await page
  .locator(
    ".col-lg-3 > .form-group > .css-b62m3t-container > .react-select__control > .react-select__value-container > .react-select__input-container"
  )
  .first()
  .click();
await page.getByText("België").click();

await page.getByTestId("contact").click();
await page.getByTestId("contact").fill("contact");
await page.getByTestId("contactEmail").click();
await page.getByTestId("contactEmail").fill("email contact");
await page.locator("div").filter({ hasText: "Telefoon nr" }).nth(4).click();
await page.getByTestId("telephone").fill("1");
await page
  .locator(
    ".col-lg-3 > .form-group > .react-select-base > .react-select__control > .react-select__value-container > .react-select__input-container"
  )
  .click();
await page.getByText("nl").click();

await page
  .locator("#rdw-wrapper-9356")
  .getByRole("textbox", { name: "rdw-editor" })
  .click();*/
