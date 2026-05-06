import { test } from "@playwright/test";

import { CommsFlowApp } from "../../src/pages/comms-flow-app";

test("template lifecycle preserves metadata and role approval rules", async ({ page }) => {
  const app = new CommsFlowApp(page);

  await app.goto();
  await app.loginAs("comms_manager");
  await app.openTemplates();
  await app.createTemplate();
  await app.expectTemplateDraftMetadata();
  await app.expectDuplicateTemplateIsIgnored();
  await app.expectTemplateDetails();
  await app.submitTemplateForApproval();
  await app.expectManagerCannotApprovePendingTemplate();
  await app.logout();

  await app.loginAs("compliance_reviewer");
  await app.openTemplates();
  await app.approveTemplate();
  await app.expectApproveButtonIsHiddenAfterApproval();
});
