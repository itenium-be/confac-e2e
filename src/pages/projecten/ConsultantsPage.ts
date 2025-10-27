import { Locator, Page } from "playwright";
import { BasePage } from "../BasePage";
import { CreateComponent } from "../../ccomponents/CreateComponent";

export class ConsultantsPage extends BasePage {
  createComponent: CreateComponent;

  createConsultantButton: Locator;
  searchInput: Locator;
  inactiveToggle: Locator;
  aanpassenButton: Locator;
  deleteButton: Locator;

  constructor(page: Page, url: string = "/consultants") {
    super(page, "/consultants");

    this.createComponent = new CreateComponent(page);

    this.createConsultantButton = page.getByTestId("add");
    this.searchInput = page.getByRole("textbox", { name: "Zoeken" });
    this.inactiveToggle = page.getByText("Toon inactieve");
    this.aanpassenButton = page.getByRole("button", { name: "" });
    this.deleteButton = page.getByRole("button", { name: "" });
  }

  /**
   * Navigate to consultants page
   */
  async goto(): Promise<void> {
    await super.goto();
  }

  /**
   * Click the button to create a new consultant
   */
  async clickCreateConsultant(): Promise<void> {
    await this.createConsultantButton.click();
  }

  /**
   * Search for a consultant
   * @param searchTerm - Text to search for
   */
  async search(searchTerm: string): Promise<void> {
    await this.searchInput.click();
    await this.searchInput.fill(searchTerm);
  }

  /**
   * Toggle showing inactive consultants
   */
  async toggleInactiveConsultants(): Promise<void> {
    await this.inactiveToggle.click();
  }

  /**
   * Click the edit button for a consultant
   */
  async clickEdit(row: number = 0): Promise<void> {
    await this.aanpassenButton.nth(row).click();
  }

  /**
   * Delete a consultant
   * @returns Promise that resolves when confirmation dialog is handled
   */
  async deleteConsultant(row: number = 0): Promise<void> {
    await this.deleteButton.nth(row).click();
  }

  /**
   * Get consultant row by name
   * @param name - Name of the consultant to find
   * @returns Locator for the consultant row
   */
  async getConsultantRow(name: string): Promise<Locator> {
    return this.page.getByRole("row", { name: new RegExp(name) });
  }

  /**
   * Get consultant name by row index
   * @param rowIndex row index to get the consultant name from
   * @returns Promise<string> with the consultant name
   */
  async getConsultantNameByRow(rowIndex: number): Promise<string> {
    const rows = this.page.locator("table tbody tr");
    const nameLink = rows.nth(rowIndex).locator("td a").first();
    const name = (await nameLink.textContent()) ?? "";
    return name.trim();
  }

  /**
   * Check if consultant exists in the list
   * @param name - Name of the consultant to check
   * @returns Promise<boolean> indicating if consultant exists
   */
  async consultantExists(name: string): Promise<boolean> {
    const row = await this.getConsultantRow(name);
    return await row.isVisible();
  }
}
