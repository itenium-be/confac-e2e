import { test, expect } from "@playwright/test";
import { setupTestEnvironment, teardownTestEnvironment } from "../../test-setup/setup";


import { KlantenPage } from "../../src/pages/Klanten/KlantenPage";
import { CreateKlantPage } from "../../src/pages/Klanten/CreateKlantPage";
import { klantTypes } from "../../src/enum/klantTypes";




let klantenPage: KlantenPage;
let createKlantPage: CreateKlantPage

test.beforeAll(async () => {
  await setupTestEnvironment();
});

test.afterAll(async () => {
  await teardownTestEnvironment();
});

test.beforeEach(async ({ page }) => {
    klantenPage = new KlantenPage(page);
    createKlantPage = new CreateKlantPage(page);
 
});

test("klant toevoegen", async ({ page }) => {
    await klantenPage.goto();

    await klantenPage.ClickOnNieuweKlant();

    await createKlantPage.btwNummerInvullen("123456789");
    await createKlantPage.ClickKlantVerderAanvullen();
    await createKlantPage.klantNaamInvullen("klant naam");
    await createKlantPage.btwInvullen("btw nummer");
    await createKlantPage.typeDropdownSelecteren(klantTypes.Eindklant);
    await createKlantPage.straatEnNummerInvullen("straat 1");
    await createKlantPage.postcodeInvullen("1000");
    await createKlantPage.stadInvullen("stad");
    await createKlantPage.landDropdownSelecteren("België");
    await createKlantPage.clickBewaren();


});


