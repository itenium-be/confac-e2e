import { Locator, Page } from "playwright";
import { BasePage } from "../BasePage";

export class ConsultantsPage extends BasePage {
  readonly otherCreationsButton: Locator;
  readonly newConsultantLink: Locator;
  readonly firstNameInput: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly telephoneInput: Locator;
  readonly accountingCodeInput: Locator;
  readonly saveButton: Locator;
  readonly searchTextbox: Locator;

  constructor(page: Page, url: string = "/consultants") {
    super(page, "/consultants");

    this.otherCreationsButton = page.getByRole("button", {
      name: "Other creations",
    });
    this.newConsultantLink = page.getByRole("link", {
      name: "Nieuwe consultant",
    });
    this.firstNameInput = page.getByTestId("firstName");
    this.nameInput = page.getByTestId("name");
    this.emailInput = page.getByTestId("email");
    this.telephoneInput = page.getByTestId("telephone");
    this.accountingCodeInput = page.getByTestId("accountingCode");
    this.saveButton = page.getByRole("button", { name: "Bewaren" });
    this.searchTextbox = page.getByRole("textbox", { name: "Zoeken" });
  }

  async goto() {
    await super.goto();
  }

  async addConsultant(
    firstName: string,
    name: string,
    email: string,
    telephone: string,
    accountingCode: string
  ): Promise<void> {
    //await this.otherCreationsButton.click();
    //await this.newConsultantLink.click();
    await this.firstNameInput.click();
    await this.firstNameInput.fill(firstName);
    await this.firstNameInput.press("Tab");
    await this.nameInput.fill(name);
    await this.nameInput.press("Tab");
    await this.emailInput.click();
    await this.emailInput.fill(email);
  }
}
