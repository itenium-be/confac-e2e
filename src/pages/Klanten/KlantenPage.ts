import { Locator, Page } from "playwright";
import { BasePage } from "../BasePage";
import { CreateComponent } from "../../components/CreateComponent";

export class KlantenPage extends BasePage {
  createComponent: CreateComponent;

  nieuweKlantButton: Locator;
  zoekenInput: Locator;
  filterdropdown: Locator;
  toonInactieveToggle: Locator;
  deleteButton: Locator;
  editButton: Locator;

  constructor(page: Page, url: string = "/clients") {
    super(page, url);

    this.createComponent = new CreateComponent(page);
    this.nieuweKlantButton = page.getByTestId("add");
    this.zoekenInput = page.getByRole("textbox", { name: "Zoeken" });
    this.filterdropdown = page.getByTestId("");
    this.toonInactieveToggle = page
      .locator("div")
      .filter({ hasText: "Toon inactieve" })
      .nth(5);
    this.deleteButton = page.getByRole("button", { name: "" });
    this.editButton = page.getByRole("button", { name: "" });
  }

  /**
   * Click the new klant button
   */
  async ClickOnNieuweKlant() {
    await this.nieuweKlantButton.click();
  }

  /**
   * Enter the given klant name in the search input
   * @param klantNaam name to be searched
   */
  async search(klantNaam: string) {
    await this.zoekenInput.fill(klantNaam);
  }

  /**
   * check if a klant exists in the klanten list
   * @param klantNaam name to validate
   * @returns @boolean true for present, false for not present
   */
  async klantExists(klantNaam: string): Promise<boolean> {
    const klantCell = this.page.getByRole("cell", { name: klantNaam });
    return (await klantCell.count()) > 0;
  }

  /**
   * delete the klant at the given row or the given row locator
   * @param row row number or row locator to delete
   */
  async deleteKlant(row: number | Locator = 0) {
    if (typeof row === "number") {
      await this.deleteButton.nth(row).click();
      return;
    } else {
      await row.getByRole("button", { name: "" }).click();
    }
  }

  /**
   * edit the klant at the given row or the given row locator
   * @param row row number or row locator to edit
   */
  async editKlant(row: number | Locator = 0) {
    if (typeof row === "number") {
      await this.editButton.nth(row).click();
      return;
    } else {
      await row.getByRole("button", { name: "" }).click();
    }
  }

  /**
   * get klant row by name
   * @param klantNaam name of the klant to find
   * @returns Locator for the klant row
   */
  async getKlantRowbyName(klantNaam: string): Promise<Locator> {
    return this.page.getByRole("row", { name: new RegExp(klantNaam) });
  }
}