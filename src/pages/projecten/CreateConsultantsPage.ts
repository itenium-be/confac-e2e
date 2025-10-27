import { Locator, Page } from "playwright";
import { BasePage } from "../BasePage";
import { CreateComponent } from "../../ccomponents/CreateComponent";

export class CreateConsultantsPage extends BasePage {
  createComponent: CreateComponent;

  readonly otherCreationsButton: Locator;
  readonly newConsultantLink: Locator;
  readonly firstNameInput: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly telephoneInput: Locator;
  readonly accountingCodeInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page, url: string = "/consultants") {
    super(page, "/consultants");

    this.createComponent = new CreateComponent(page);

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
  }

  /**
   * Got to consultants page.
   */
  async goto() {
    await super.goto();
  }

  /**
   * Create a new consultant with the provided details. (E2E)
   * @param firstName first name of the consultant
   * @param name last name / family name
   * @param email email address
   * @param telephone telephone number
   * @param accountingCode accounting code string
   */
  async addConsultant(
    firstName: string,
    name: string,
    email: string,
    telephone: string,
    accountingCode: string
  ): Promise<void> {
    await this.setFirstName(firstName);
    await this.setName(name);
    await this.setEmail(email);
    await this.setTelephone(telephone);
    await this.setAccountingCode(accountingCode);
    await this.clickSave();
  }

  /**
   * Set the first name input.
   * @param firstName value to type into the firstName field
   */
  async setFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.click();
    await this.firstNameInput.fill(firstName);
  }

  /**
   * Set the name input.
   * @param name value to type into the name field
   */
  async setName(name: string): Promise<void> {
    await this.nameInput.click();
    await this.nameInput.fill(name);
  }

  /**
   * Set the email input.
   * @param email value to type into the email field
   */
  async setEmail(email: string): Promise<void> {
    await this.emailInput.click();
    await this.emailInput.fill(email);
  }

  /**
   * Set the telephone input.
   * @param telephone value to type into the telephone field
   */
  async setTelephone(telephone: string): Promise<void> {
    await this.telephoneInput.click();
    await this.telephoneInput.fill(telephone);
  }

  /**
   * Set the accounting code input.
   * @param accountingCode value to type into the accountingCode field
   */
  async setAccountingCode(accountingCode: string): Promise<void> {
    await this.accountingCodeInput.click();
    await this.accountingCodeInput.fill(accountingCode);
  }

  /**
   * Click the save button.
   */
  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }

  /**
   * Open the "Nieuwe consultant" form.
   */
  async openNewConsultant(): Promise<void> {
    await this.newConsultantLink.click();
  }
}
