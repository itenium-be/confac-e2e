import { test, expect } from "@playwright/test";
import { ConsultantsPage } from "../../../src/pages/projecten/ConsultantsPage";
import { CreateConsultantsPage } from "../../../src/pages/projecten/CreateConsultantsPage";
import { GenericContainer } from "testcontainers";
import { setupTestEnvironment, teardownTestEnvironment } from "../../../test-setup/setup";

let container;


let consultantsPage: ConsultantsPage;
let createConsultantsPage: CreateConsultantsPage;

test.beforeAll(async () => {
  await setupTestEnvironment();
});

test.afterAll(async () => {
  await teardownTestEnvironment();
});

test.beforeEach(async ({ page }) => {
  consultantsPage = new ConsultantsPage(page);
  createConsultantsPage = new CreateConsultantsPage(page);
 
});

test("consultant toevoegen", async ({ page }) => {
  await consultantsPage.goto();

  await consultantsPage.createComponent.clickCreateNewConsultant();

  await createConsultantsPage.addConsultant("first name", "name", "email", "nummer", "kostendrager");

  await page.getByRole("button", { name: "Bewaren" }).click();
  await page.getByRole("textbox", { name: "Zoeken" }).click();
  await page.getByRole("textbox", { name: "Zoeken" }).fill("naam");
});

test("consultant zoeken", async ({ page }) => {
  let search = "Alanna";
  await consultantsPage.goto();

  await consultantsPage.search(search);
  
  expect(await consultantsPage.consultantExists(search)).toBeTruthy;


});

test("consultant verwijderen", async ({ page }) => {
  let rowToDelete = 5;

  await consultantsPage.goto();

  let name = await consultantsPage.getConsultantNameByRow(rowToDelete);
  await consultantsPage.deleteConsultant(rowToDelete);

  expect(await consultantsPage.consultantExists(name)).toBeFalsy();

});
test("consultant aanpassen", async ({ page }) => {
  let rowToUpdate = 5;
  let newName = "Aangepaste voornaam";
  
  await consultantsPage.goto();
  
  let name = await consultantsPage.getConsultantNameByRow(rowToUpdate);
  await consultantsPage.clickEdit(5);

  await createConsultantsPage.setFirstName(newName);
  await createConsultantsPage.clickSave();
  expect(await consultantsPage.consultantExists(newName)).toBeTruthy

});

