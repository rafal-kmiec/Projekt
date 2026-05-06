import { test } from "@playwright/test";

import { CommsFlowApp } from "../../src/pages/comms-flow-app";

test("regulated communication approval and send flow", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await app.loginAs("comms_manager");
  await app.openTemplates();
  await app.createTemplate();
  await app.submitTemplateForApproval();
  await app.logout();

  await app.loginAs("compliance_reviewer");
  await app.openTemplates();
  await app.approveTemplate();
  await app.logout();

  await app.loginAs("comms_manager");
  await app.openCampaigns();
  await app.sendPolicyRenewalCampaign();
  await app.openArchive();
  await app.expectArchiveEvidence();
  await app.openDashboard();
  await app.expectDashboardEvidence();
});
