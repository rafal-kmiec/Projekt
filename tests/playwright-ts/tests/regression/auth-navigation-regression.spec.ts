import { test } from "@playwright/test";

import { CommsFlowApp } from "../../src/pages/comms-flow-app";

test("auth session and protected routing stay consistent", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await app.loginAs("comms_manager");
  await app.expectManagerLandsOnDashboard();
  await app.expectSessionPersistsAfterRefresh();
  await app.logout();
  await app.openProtectedArchiveWhileLoggedOut();

  await app.loginAs("compliance_reviewer");
  await app.expectReviewerLandsOnTemplates();
});

test("role profile and topbar navigation expose the demo workspace", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await app.loginAs("comms_manager");
  await app.expectManagerAccessProfile();
  await app.expectTopbarNavigation();
});

test("reviewer permissions are visible and block template creation", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await app.loginAs("compliance_reviewer");
  await app.expectReviewerLandsOnTemplates();
  await app.expectReviewerAccessProfile();
  await app.openTemplates();
  await app.expectReviewerCannotCreateTemplate();
});
