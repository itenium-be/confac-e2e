import { Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";
import { DateHelper } from "../../utils/helpers/DateHelper";

export class CreateProjectenPage extends BasePage {
  readonly accountManagerDropdown: Locator;
  readonly consultantDropdown: Locator;
  readonly eindKlantDropdown: Locator;
  readonly startDatum: Locator;
  readonly bewarenButton: Locator;

  constructor(page: Page, url: string = "/projects/create") {
    super(page, url);

    this.accountManagerDropdown = page
      .locator('div.form-group:has-text("Account Manager")')
      .locator("div.react-select__control");
    this.consultantDropdown = page
      .locator('div.form-group:has-text("Consultant")')
      .locator("div.react-select__control");
    this.eindKlantDropdown = page
      .locator('div.form-group:has-text("Eindklant")')
      .locator("div.react-select__control");

    this.startDatum = page.getByRole("textbox", { name: "Start datum" });

    this.bewarenButton = page.getByRole("button", { name: "Bewaren" });
  }

  /**
   * Select the given account manager, based on text or number
   * @param accountManager String or Number, string matches text. Number matches position (starting from 0). De
   */
  async selectAccountManager(accountManager: string | number = 0) {
    await this.accountManagerDropdown.click();

    if (typeof accountManager === "number") {
      await this.page
        .locator(".react-select__option")
        .nth(accountManager)
        .click();
    } else {
      await this.page
        .locator(".react-select__option", {
          hasText: accountManager,
        })
        .click();
    }
  }

  /**
   * Select the given consult, based on text or number
   * @param consultant String or n
   */
  async selectconsultant(consultant: string | number = 0) {
    await this.consultantDropdown.click();

    if (typeof consultant === "number") {
      await this.page.locator(".react-select__option").nth(consultant).click();
    } else {
      await this.page
        .locator(".react-select__option", {
          hasText: consultant,
        })
        .click();
    }
  }

  /**
   * Select the given eindklant
   * @param eindKlant String or Number, string matches text. Number matches position (starting from 0)
   */
  async selectEindKlant(eindKlant: string | number = 0) {
    await this.eindKlantDropdown.click();

    if (typeof eindKlant === "number") {
      await this.page.locator(".react-select__option").nth(eindKlant).click({force: true });
    } else {
      await this.page
        .locator(".react-select__option", {
          hasText: eindKlant,
        })
        .click({force: true });
    }
  }

  /**
   * Set the start datum
   * @param date
   */
  async setStartDatum(date: string = DateHelper.todayDMY()) {
    await this.startDatum.fill(date);
  }

  /**
   * Click the bewaren button
   */
  async clickBewaren() {
    await Promise.all([
      this.page.waitForURL("**/projects"), // update pattern to […] path you expect
      this.bewarenButton.click(),
    ]);
  }
}
