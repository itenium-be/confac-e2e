import { test, expect } from "@playwright/test";
import {
  setupTestEnvironment,
  teardownTestEnvironment,
} from "../../test-setup/setup";
import { ProjectenPage } from "../../src/pages/projecten/ProjectenPage";
import { CreateProjectenPage } from "../../src/pages/projecten/CreateProjectenPage";
import { KlantApi } from "../../src/utils/API/KlantApi";
import { ConsultantApi } from "../../src/utils/API/ConsultantApi ";
import { UserApi } from "../../src/utils/API/UserAPI";
import { AlphaNumericHelper } from "../../src/utils/helpers/AlphaNumericHelper";
import { ProjectApi } from "../../src/utils/API/PrjectAPI";

let projectenPage: ProjectenPage;
let createProjectenPage: CreateProjectenPage;

test.beforeAll(async () => {
  await setupTestEnvironment();
});

test.afterAll(async () => {
  await teardownTestEnvironment();
});

test.beforeEach(async ({ page }) => {
  projectenPage = new ProjectenPage(page);
  createProjectenPage = new CreateProjectenPage(page);
});

test("project toevoegen", async ({ page, request }) => {
  let klant = "projectKlant" + AlphaNumericHelper.randomAlphanumeric(4);
  let consultant = "ProjectConsultant";
  let user = "e2e-test-user";

  await KlantApi.safeCreateKlant(request, { name: klant });
  await ConsultantApi.safeCreateConsultant(request, { name: consultant });
  await UserApi.safeCreateUser(request);

  await createProjectenPage.goto();

  await createProjectenPage.selectAccountManager("e2e-test-user");
  await createProjectenPage.selectconsultant(consultant);
  await createProjectenPage.selectEindKlant(klant);
  await createProjectenPage.setStartDatum();

  await createProjectenPage.clickBewaren();
});

test("Project zoeken", async ({ page, request }) => {
  let klant = "projectKlant" + AlphaNumericHelper.randomAlphanumeric(4);
  let consultant = "ProjectConsultant";
  let user = "e2e-test-user";

  await KlantApi.safeCreateKlant(request, { name: klant });
  await ConsultantApi.safeCreateConsultant(request, { name: consultant });
  await UserApi.safeCreateUser(request);
  await ProjectApi.create(request, {
    accountManagerName: user,
    consultantName: consultant,
    clientName: klant,
  });

  await projectenPage.goto();
  await projectenPage.enterZoeken(klant);

  await projectenPage.projectExists(klant);
});

test("Project aanpassen", async ({ page, request }) => {
  let klant = "projectKlant" + AlphaNumericHelper.randomAlphanumeric(4);
  let klant2 = "projectKlantedit" + AlphaNumericHelper.randomAlphanumeric(4);
  let consultant = "ProjectConsultant";
  let user = "e2e-test-user";

  await KlantApi.safeCreateKlant(request, { name: klant });
    await KlantApi.safeCreateKlant(request, { name: klant2 });

  await ConsultantApi.safeCreateConsultant(request, { name: consultant });
  await UserApi.safeCreateUser(request);
  await ProjectApi.create(request, {
    accountManagerName: user,
    consultantName: consultant,
    clientName: klant,
  });

  await projectenPage.goto();
  await projectenPage.enterZoeken(klant);
  await projectenPage.getProjectRowbyName(klant).then(async (row) => {
    await projectenPage.editProject(row);
  });

  await createProjectenPage.selectEindKlant(klant2);
  await createProjectenPage.clickBewaren();

  await projectenPage.projectExists(klant2);
});
