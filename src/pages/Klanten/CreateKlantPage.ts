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
    this.typeDropdown = page
      .locator(
        ".react-select__value-container.react-select__value-container--is-multi > .react-select__input-container"
      )
      .first();
    this.typeDropdownOptions = page.locator("#react-select-4-listbox");
    this.straatEnNummerInput = page.getByTestId("address");
    this.PostcodeInput = page.getByTestId("postalCode");
    this.stadInput = page.getByTestId("city");
    this.landDropdown = page
      .locator(
        ".col-lg-3 > .form-group > .css-b62m3t-container > .react-select__control > .react-select__value-container > .react-select__input-container"
      )
      .first();
    this.landDropdownOptions = page.locator("#react-select-5-listbox");

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
   * enter the given btw number (in the initial create page)
   * @param btwNummer string to repsrent the btw nummer
   */
  async btwNummerInvullen(btwNummer: string) {
    await this.btwNummerInput.fill(btwNummer);
  }
  /**
   * Click the verder aanvullen button
   */
  async ClickKlantVerderAanvullen() {
    await this.klantVerderAanvullenButton.click();
  }

  /**
   * enter the given klant name
   * @param klantNaam name to enter
   */
  async klantNaamInvullen(klantNaam: string) {
    await this.klantInput.fill(klantNaam);
  }

  /**
   * enter the btw number (on the full creation page)
   * @param btw string to represent the btw number
   * @returns
   */
  async btwInvullen(btw: string) {
    await this.btwInput.fill(btw);

    return this;
  }

  /**
   * select the given type from the type dropdown
   * opens the dropdown and selects from the given options
   * @param type see @KlantTypes enum
   */
  async typeDropdownSelecteren(type: klantTypes) {
    await this.typeDropdown.click();
    await this.typeDropdownOptions
      .locator(".react-select__option", { hasText: type })
      .click();
  }

  /**
   * enter the straat en nummer input
   * @param straatEnNummer string to enter
   */
  async straatEnNummerInvullen(straatEnNummer: string) {
    await this.straatEnNummerInput.fill(straatEnNummer);
  }

  /**
   * enter the postcode
   * @param postcode string to enter
   */
  async postcodeInvullen(postcode: string) {
    await this.PostcodeInput.fill(postcode);
  }

  /**
   * enter the stad
   * @param stad string to enter
   */
  async stadInvullen(stad: string) {
    await this.stadInput.fill(stad);
  }

  /**
   * select the given land from the land dropdown
   * @param land land to select
   */
  async landDropdownSelecteren(land: string) {
    await this.landDropdown.click();
    await this.landDropdownOptions
      .locator(".react-select__option", { hasText: land })
      .click();
  }

  /**
   * contact gegevens invullen
   * @param contactGegevens string to enter
   */
  async contactGegevensInvullen(contactGegevens: string) {
    await this.contactGegevensInput.fill(contactGegevens);
  }

  /**
   * contact email invullen
   * @param contactEmail string to enter
   */
  async contactEmailInvullen(contactEmail: string) {
    await this.contactEmailInput.fill(contactEmail);
  }

  /**
   * telefoon nr invullen
   * @param telefoonNr string to enter
   */
  async telefoonNrInvullen(telefoonNr: string) {
    await this.telefoonNrInput.fill(telefoonNr);
  }
  
  /**
   * select the given taal from the taal dropdown
   * @param taal string to select
   */
  async taalDropdownSelecteren(taal: string) {
    await this.taalDropdown.click();
    await this.page.getByText(taal).click();
  }

  /**
   * click the bewaren button. Navigates back to klanten page
   */
  async clickBewaren() {
    await this.bewarenButton.click();
  }
}
