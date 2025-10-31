import { test, expect } from "@playwright/test";

import { KlantenPage } from "../../src/pages/Klanten/KlantenPage";
import { CreateKlantPage } from "../../src/pages/Klanten/CreateKlantPage";
import { klantTypes } from "../../src/enum/klantTypes";
import { AlphaNumericHelper } from "../../src/utils/helpers/AlphaNumericHelper";
import { KlantApi } from "../../src/utils/API/KlantApi";

let klantenPage: KlantenPage;
let createKlantPage: CreateKlantPage;

test.beforeEach(async ({ page }) => {
  klantenPage = new KlantenPage(page);
  createKlantPage = new CreateKlantPage(page);
});

test("klant toevoegen", async ({ page }) => {
  await klantenPage.goto();

  await klantenPage.ClickOnNieuweKlant();

  await createKlantPage.btwNummerInvullen(AlphaNumericHelper.randomBtw());
  await createKlantPage.ClickKlantVerderAanvullen();
  await createKlantPage.klantNaamInvullen(
    "test" + AlphaNumericHelper.randomName()
  );
  //await createKlantPage.btwInvullen("btw nummer"); --skipping as it is already pre filled here
  await createKlantPage.typeDropdownSelecteren(klantTypes.Eindklant);
  await createKlantPage.straatEnNummerInvullen(
    AlphaNumericHelper.randomStraat() + AlphaNumericHelper.randomNumeric(1)
  );
  await createKlantPage.postcodeInvullen(AlphaNumericHelper.randomNumeric(4));
  await createKlantPage.stadInvullen("stad");
  await createKlantPage.landDropdownSelecteren("België");

  const [response] = await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes("api/clients") && res.request().method() === "POST"
    ),
    createKlantPage.clickBewaren(),
  ]);
  expect(response.status()).toBe(200);
});

test("klant zoeken", async ({ page, request }) => {
  let klantNaam = "search klant";

  await KlantApi.safeCreateKlant(request, {
    name: klantNaam + AlphaNumericHelper.randomAlpha(4),
  });
  await klantenPage.goto();

  await klantenPage.search(klantNaam);

  expect(await klantenPage.klantExists(klantNaam)).toBeTruthy();
});

test("klant verwijderen", async ({ page, request }) => {
  let klantNaam = "search klant";

  await KlantApi.safeCreateKlant(request, {
    name: klantNaam + AlphaNumericHelper.randomAlpha(4),
  });

  await klantenPage.goto();

  await klantenPage.getKlantRowbyName(klantNaam).then(async (row) => {
    await klantenPage.deleteKlant(row);
  });

  expect(await klantenPage.klantExists(klantNaam)).toBeFalsy();
});

test("klant aanpassen", async ({ page, request }) => {
  let klantNaam = "search klant";

  await KlantApi.safeCreateKlant(request, {
    name: klantNaam + AlphaNumericHelper.randomAlpha(4),
  });
  let updatedKlantNaam = "aangepaste klant naam";
  await klantenPage.goto();

  await klantenPage.search(klantNaam);
  await klantenPage.getKlantRowbyName(klantNaam).then(async (row) => {
    await klantenPage.editKlant(row);
  });

  await createKlantPage.klantNaamInvullen(updatedKlantNaam);

  await createKlantPage.clickBewaren();

  expect(await klantenPage.klantExists(updatedKlantNaam)).toBeTruthy();
});
