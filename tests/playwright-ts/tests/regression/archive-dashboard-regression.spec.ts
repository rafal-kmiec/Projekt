import { test } from "@playwright/test";

import { CommsFlowApp } from "../../src/pages/comms-flow-app";

async function completeApprovalFlow(app: CommsFlowApp) {
  await app.loginAs("comms_manager");
  await app.openTemplates();
  await app.createTemplate();
  await app.submitTemplateForApproval();
  await app.openDashboard();
  await app.expectDashboardMetrics(1, 0, 0, 0);
  await app.logout();

  await app.loginAs("compliance_reviewer");
  await app.openTemplates();
  await app.approveTemplate();
  await app.logout();
}

test("archive search supports campaign, channel, status, case, and clearing", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await completeApprovalFlow(app);

  await app.loginAs("comms_manager");
  await app.openCampaigns();
  await app.sendPolicyRenewalCampaign();
  await app.openArchive();
  await app.expectArchiveSearchByCampaignChannelStatusAndTrimmedCase();
});

test("dashboard metrics and audit trail follow the workflow timeline", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await app.loginAs("comms_manager");
  await app.expectDashboardMetrics(0, 0, 0, 0);
  await app.openTemplates();
  await app.createTemplate();
  await app.submitTemplateForApproval();
  await app.openDashboard();
  await app.expectDashboardMetrics(1, 0, 0, 0);
  await app.logout();

  await app.loginAs("compliance_reviewer");
  await app.openTemplates();
  await app.approveTemplate();
  await app.logout();

  await app.loginAs("comms_manager");
  await app.openDashboard();
  await app.expectDashboardMetrics(0, 1, 0, 0);
  await app.openCampaigns();
  await app.sendPolicyRenewalCampaign();
  await app.openDashboard();
  await app.expectDashboardMetrics(0, 1, 1, 4);
  await app.expectAuditTrailContainsWorkflowInNewestFirstOrder();
});

test("customers and inbox pages expose static demo evidence", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await app.loginAs("comms_manager");
  await app.openCustomers();
  await app.expectCustomersPageData();
  await app.openInbox();
  await app.expectInboxEmptyState();
});
