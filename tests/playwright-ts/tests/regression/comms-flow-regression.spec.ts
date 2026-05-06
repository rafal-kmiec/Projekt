import { test } from "@playwright/test";

import { CommsFlowApp } from "../../src/pages/comms-flow-app";

test("demo surfaces empty states and manager permissions", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await app.loginAs("comms_manager");
  await app.expectManagerAccessProfile();
  await app.openTemplates();
  await app.expectTemplatesEmptyState();
  await app.openCampaigns();
  await app.expectCampaignsEmptyState();
  await app.expectCampaignRequiresApprovedTemplate();
  await app.openArchive();
  await app.expectArchiveInitialEmptyState();
});

test("record details, policy search, and audit trail stay consistent", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await app.loginAs("comms_manager");
  await app.openTemplates();
  await app.createTemplate();
  await app.expectTemplateDetails();
  await app.submitTemplateForApproval();
  await app.logout();

  await app.loginAs("compliance_reviewer");
  await app.openTemplates();
  await app.approveTemplate();
  await app.logout();

  await app.loginAs("comms_manager");
  await app.openCampaigns();
  await app.sendPolicyRenewalCampaign();
  await app.expectCampaignDetails();
  await app.openArchive();
  await app.expectArchiveSearchByPolicyNumber();
  await app.openDashboard();
  await app.expectDashboardEvidence();
});
