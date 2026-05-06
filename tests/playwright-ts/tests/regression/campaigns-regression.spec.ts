import { test } from "@playwright/test";

import { CommsFlowApp } from "../../src/pages/comms-flow-app";

async function createApprovedTemplate(app: CommsFlowApp) {
  await app.loginAs("comms_manager");
  await app.openTemplates();
  await app.createTemplate();
  await app.submitTemplateForApproval();
  await app.logout();

  await app.loginAs("compliance_reviewer");
  await app.openTemplates();
  await app.approveTemplate();
}

test("reviewer cannot send a campaign even with an approved template", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await createApprovedTemplate(app);
  await app.openCampaigns();
  await app.expectReviewerCannotSendCampaign();
  await app.expectCampaignsEmptyState();
});

test("manager can send a campaign to selected customers only", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await createApprovedTemplate(app);
  await app.logout();

  await app.loginAs("comms_manager");
  await app.openCampaigns();
  await app.sendPolicyRenewalCampaignToCustomers(["cust-001", "cust-002"]);
  await app.expectCampaignRecipients(2);
  await app.expectCampaignDetails();
  await app.openArchive();
  await app.expectArchiveEvidenceForSelectedCustomers();
  await app.openDashboard();
  await app.expectDashboardMetrics(0, 1, 1, 2);
});

test("campaign without recipients does not create delivery evidence", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await createApprovedTemplate(app);
  await app.logout();

  await app.loginAs("comms_manager");
  await app.openCampaigns();
  await app.attemptCampaignWithoutRecipients();
  await app.openArchive();
  await app.expectArchiveInitialEmptyState();
  await app.openDashboard();
  await app.expectDashboardMetrics(0, 1, 0, 0);
});
