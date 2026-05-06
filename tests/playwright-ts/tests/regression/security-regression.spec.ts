import { test } from "@playwright/test";

import { CommsFlowApp } from "../../src/pages/comms-flow-app";

const htmlPayload = "<img src=x onerror=alert(1)>";
const campaignPayload = "<svg onload=alert(1)>Security Notice</svg>";

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

test("protected routes require an active authenticated user", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.expectProtectedRoutesRequireLogin();
  await app.goto();
  await app.loginAs("comms_manager");
  await app.openArchive();
  await app.expectDirectRouteAfterLogoutRequiresLogin("/archive");
});

test("localStorage tampering falls back to canonical account permissions", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.expectCorruptedStorageFallsBackToLogin();
  await app.expectUnknownStoredUserFallsBackToLogin();
  await app.expectTamperedManagerPermissionsAreCanonical();
});

test("role-based action guardrails block restricted workflow mutations", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await app.loginAs("comms_manager");
  await app.openTemplates();
  await app.createTemplate();
  await app.submitTemplateForApproval();
  await app.expectManagerCannotApprovePendingTemplate();
  await app.openDashboard();
  await app.expectDashboardMetrics(1, 0, 0, 0);
  await app.logout();

  await app.loginAs("compliance_reviewer");
  await app.openTemplates();
  await app.expectReviewerCannotCreateTemplate();
  await app.approveTemplate();
  await app.openCampaigns();
  await app.expectReviewerCannotSendCampaign();
  await app.openArchive();
  await app.expectArchiveInitialEmptyState();
});

test("user-controlled text is rendered without executing script payloads", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await app.loginAs("comms_manager");
  await app.openTemplates();
  await app.expectTemplateNamePayloadIsRenderedAsText(htmlPayload);
  await app.createTemplate();
  await app.submitTemplateForApproval();
  await app.logout();

  await app.loginAs("compliance_reviewer");
  await app.openTemplates();
  await app.approveTemplate();
  await app.logout();

  await app.loginAs("comms_manager");
  await app.openCampaigns();
  await app.sendCampaignWithName(campaignPayload);
  await app.openArchive();
  await app.expectArchiveSearchPayloadIsSafe(htmlPayload);
});

test("authenticated pages and persisted state do not expose demo passwords", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await app.loginAs("comms_manager");
  await app.expectPasswordIsNotExposedAfterLogin();
  await app.logout();

  await createApprovedTemplate(app);
  await app.logout();
  await app.loginAs("comms_manager");
  await app.openCampaigns();
  await app.sendPolicyRenewalCampaign();
  await app.openDashboard();
  await app.expectAuditTrailContainsWorkflowInNewestFirstOrder();
});
