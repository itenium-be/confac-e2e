import { Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";
import { CreateComponent } from "../../components/CreateComponent";

export class ProjectenPage extends BasePage {
  CreateComponent: CreateComponent;

  readonly nieuwProjectButton: Locator;
  readonly zoekenInput: Locator;
  readonly inactieveToggle: Locator;
  readonly editButton: Locator;

  constructor(page: Page, url: string = "/projects") {
    super(page, url);

    this.CreateComponent = new CreateComponent(page);

    this.nieuwProjectButton = page.getByTestId("add");
    this.zoekenInput = page.getByRole("textbox", { name: "Zoeken" });
    this.inactieveToggle = page.locator("span").nth(3);
    this.editButton = page.getByRole("button", { name: "" });
  }

  /**
   * Click the nieuw project button (on the page)
   * redirects to @CreateProjectenPage
   */
  async clickNieuwProject() {
    await this.nieuwProjectButton.click();
  }

  /**
   *
   * @param project
   */
  async enterZoeken(project: string) {
    await this.zoekenInput.fill(project);
  }

  /**
   * Edit the project at the given row or the given row locator
   * @param row row number or row locator to edit
   */
  async editProject(row: number | Locator = 0) {
    if (typeof row === "number") {
      await this.editButton.nth(row).click({force: true});
      return;
    } else {
      await row.getByRole("button", { name: "" }).click({force: true});
    }

    await this.page.evaluate(() => Promise.resolve()); // flush microtasks - page UI hangs without this for some reason
  }

  /**
   * Toggle showing inactive projecten
   */
  async toggleInactiveConsultants(): Promise<void> {
    await this.inactieveToggle.click();
  }

  /**
   * Get project row by name
   * @param name - Name of the project to find
   * @returns Locator for the project row
   */
  async getProjectRow(name: string): Promise<Locator> {
    return this.page.getByRole("row", { name: new RegExp(name) });
  }

  /**
   * Get project name by row index
   * @param rowIndex row index to get the project name from
   * @returns Promise<string> with the project name
   */
  async getProjectNameByRow(rowIndex: number): Promise<string> {
    const rows = this.page.locator("table tbody tr");
    const nameLink = rows.nth(rowIndex).locator("td a").first();
    const name = (await nameLink.textContent()) ?? "";
    return name.trim();
  }

  /**
   * Check if project exists in the list
   * @param name - Name of the project to check
   * @returns Promise<boolean> indicating if project exists
   */
  async projectExists(name: string): Promise<boolean> {
    const row = await this.getProjectRow(name);
    return await row.isVisible();
  }

  /**
   * Get project row by name
   * @param name - Name of the project to find
   * @returns Locator for the project row
   */
  async getProjectRowbyName(name: string): Promise<Locator> {
    return this.page.getByRole("row", { name: new RegExp(name) });
  }
}
