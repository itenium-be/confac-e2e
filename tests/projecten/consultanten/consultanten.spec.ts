import { test, expect } from "@playwright/test";
import { ConsultantsPage } from "../../../src/pages/projecten/ConsultantsPage";

//test.describe("Consultanten pagina", () => {
let consultantsPage: ConsultantsPage;

test.beforeEach(async ({ page }) => {
  consultantsPage = new ConsultantsPage(page);
});

test("consultant toevoegen", async ({ page }) => {
  await consultantsPage.goto();

  await page.getByRole("button", { name: "Other creations" }).click();
  await page.getByRole("link", { name: "Nieuwe consultant" }).click();
  await page.getByTestId("firstName").click();
  await page.getByTestId("firstName").fill("voornaam");
  await page.getByTestId("firstName").press("Tab");
  await page.getByTestId("name").fill("naam");
  await page.getByTestId("name").press("Tab");
  await page.getByTestId("email").click();
  await page.getByTestId("email").fill("email");
  await page.getByTestId("email").press("Tab");
  await page.getByTestId("telephone").click();
  await page.getByTestId("telephone").fill("nummer");
  await page.getByTestId("accountingCode").click();
  await page.getByTestId("accountingCode").click();
  await page.getByTestId("accountingCode").fill("kostendrager");
  await page.getByRole("button", { name: "Bewaren" }).click();
  await page.getByRole("textbox", { name: "Zoeken" }).click();
  await page.getByRole("textbox", { name: "Zoeken" }).fill("naam");
});
//});
