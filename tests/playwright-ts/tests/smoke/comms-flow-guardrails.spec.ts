import { test } from "@playwright/test";

import { CommsFlowApp } from "../../src/pages/comms-flow-app";

test("invalid credentials keep the user on login", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await app.attemptInvalidLogin();
});

test("role permissions protect template approval and campaign send", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await app.loginAs("comms_manager");
  await app.openTemplates();
  await app.createTemplate();
  await app.submitTemplateForApproval();
  await app.expectManagerCannotApprovePendingTemplate();
  await app.openCampaigns();
  await app.expectCampaignRequiresApprovedTemplate();
  await app.logout();

  await app.loginAs("compliance_reviewer");
  await app.openTemplates();
  await app.expectReviewerCannotCreateTemplate();
  await app.approveTemplate();
});
