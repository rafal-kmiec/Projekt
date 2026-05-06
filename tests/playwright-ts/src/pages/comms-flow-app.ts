import { expect, type Page } from "@playwright/test";

type Username = "comms_manager" | "compliance_reviewer";
type CustomerId = "cust-001" | "cust-002" | "cust-003" | "cust-004";

export class CommsFlowApp {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/");
    await expect(this.page.getByTestId("login-page")).toBeVisible();
  }

  async loginAs(username: Username, password = "commsflow123") {
    await this.page.getByTestId("username-input").fill(username);
    await this.page.getByTestId("password-input").fill(password);
    await this.page.getByTestId("login-submit").click();
  }

  async openProtectedArchiveWhileLoggedOut() {
    await this.page.goto("/archive");
    await expect(this.page.getByTestId("login-page")).toBeVisible();
  }

  async attemptInvalidLogin() {
    await this.page.getByTestId("username-input").fill("unknown_user");
    await this.page.getByTestId("password-input").fill("wrong-password");
    await this.page.getByTestId("login-submit").click();
    await expect(this.page.getByTestId("login-error")).toContainText("Invalid credentials");
    await expect(this.page.getByTestId("login-page")).toBeVisible();
  }

  async expectManagerLandsOnDashboard() {
    await expect(this.page.getByTestId("dashboard-page")).toBeVisible();
    await expect(this.page.getByTestId("current-user")).toContainText("Comms Manager");
  }

  async expectReviewerLandsOnTemplates() {
    await expect(this.page.getByTestId("templates-page")).toBeVisible();
    await expect(this.page.getByTestId("current-user")).toContainText("Compliance Reviewer");
  }

  async expectSessionPersistsAfterRefresh() {
    await this.page.reload();
    await expect(this.page.getByTestId("dashboard-page")).toBeVisible();
    await expect(this.page.getByTestId("current-user")).toContainText("Comms Manager");
  }

  async expectManagerAccessProfile() {
    await expect(this.page.getByTestId("access-profile")).toContainText("Comms Manager");
    await expect(this.page.getByTestId("permission-list")).toContainText("Create templates");
    await expect(this.page.getByTestId("permission-list")).toContainText("Submit for approval");
    await expect(this.page.getByTestId("permission-list")).toContainText("Send campaigns");
    await expect(this.page.getByTestId("current-permissions")).toContainText("3 permissions");
  }

  async expectReviewerAccessProfile() {
    await this.openDashboard();
    await expect(this.page.getByTestId("access-profile")).toContainText("Compliance Reviewer");
    await expect(this.page.getByTestId("permission-list")).toContainText("Approve regulated notices");
    await expect(this.page.getByTestId("current-permissions")).toContainText("1 permissions");
  }

  async logout() {
    await this.page.getByTestId("logout-button").click();
    await expect(this.page.getByTestId("login-page")).toBeVisible();
  }

  async expectTopbarNavigation() {
    await this.openDashboard();
    await this.openCustomers();
    await this.openTemplates();
    await this.openCampaigns();
    await this.openInbox();
    await this.openArchive();
  }

  async openTemplates() {
    await this.page.getByTestId("nav-templates").click();
    await expect(this.page.getByTestId("templates-page")).toBeVisible();
  }

  async createTemplate(name = "Policy Renewal Notice") {
    await this.page.getByTestId("template-name-input").fill(name);
    await this.page.getByTestId("template-create-button").click();
    await expect(this.page.getByTestId("template-card-policy-renewal-notice")).toBeVisible();
  }

  async expectTemplateDraftMetadata() {
    const card = this.page.getByTestId("template-card-policy-renewal-notice");
    await expect(card).toContainText("Version 1");
    await expect(card).toContainText("Owner: Comms Manager");
    await expect(this.page.getByTestId("template-status-policy-renewal-notice")).toContainText("Draft");
  }

  async expectDuplicateTemplateIsIgnored() {
    await this.createTemplate();
    await expect(this.page.getByTestId("template-card-policy-renewal-notice")).toHaveCount(1);
  }

  async expectTemplatesEmptyState() {
    await expect(this.page.getByTestId("templates-empty-state")).toContainText("No communication templates");
  }

  async expectTemplateDetails() {
    await this.page.getByTestId("template-details-policy-renewal-notice").click();
    await expect(this.page.getByTestId("template-details-policy-renewal-notice")).toContainText("Compliance approval required");
    await expect(this.page.getByTestId("template-details-policy-renewal-notice")).toContainText("Email, SMS, Portal, Print");
  }

  async submitTemplateForApproval() {
    await this.page.getByTestId("submit-template-policy-renewal-notice").click();
    await expect(this.page.getByTestId("template-status-policy-renewal-notice")).toContainText("Pending Approval");
  }

  async expectManagerCannotApprovePendingTemplate() {
    await expect(this.page.getByTestId("manager-approval-blocked-policy-renewal-notice")).toContainText("Approval is restricted");
    await expect(this.page.getByTestId("approve-template-policy-renewal-notice")).toHaveCount(0);
  }

  async expectReviewerCannotCreateTemplate() {
    await expect(this.page.getByTestId("template-permission-note")).toContainText("Template creation restricted");
    await expect(this.page.getByTestId("template-form")).toHaveCount(0);
  }

  async approveTemplate() {
    await this.page.getByTestId("approve-template-policy-renewal-notice").click();
    await expect(this.page.getByTestId("template-status-policy-renewal-notice")).toContainText("Approved");
  }

  async expectApproveButtonIsHiddenAfterApproval() {
    await expect(this.page.getByTestId("approve-template-policy-renewal-notice")).toHaveCount(0);
  }

  async openCampaigns() {
    await this.page.getByTestId("nav-campaigns").click();
    await expect(this.page.getByTestId("campaigns-page")).toBeVisible();
  }

  async expectCampaignRequiresApprovedTemplate() {
    await expect(this.page.getByTestId("campaign-no-template-warning")).toContainText("approved template is required");
    await expect(this.page.getByTestId("campaign-send-button")).toBeDisabled();
  }

  async expectReviewerCannotSendCampaign() {
    await expect(this.page.getByTestId("campaign-permission-warning")).toContainText("Only Comms Managers can send campaigns");
    await expect(this.page.getByTestId("campaign-send-button")).toBeDisabled();
  }

  async expectCampaignsEmptyState() {
    await expect(this.page.getByTestId("campaigns-empty-state")).toContainText("No campaigns");
  }

  async sendPolicyRenewalCampaign() {
    await this.sendPolicyRenewalCampaignToCustomers(["cust-001", "cust-002", "cust-003", "cust-004"]);
    await this.expectCampaignRecipients(4);
  }

  async sendPolicyRenewalCampaignToCustomers(customerIds: CustomerId[]) {
    await this.page.getByTestId("campaign-template-select").selectOption("policy-renewal-notice");
    for (const customerId of ["cust-001", "cust-002", "cust-003", "cust-004"] as CustomerId[]) {
      const checkbox = this.page.getByTestId(`customer-checkbox-${customerId}`);
      const shouldBeChecked = customerIds.includes(customerId);
      if (await checkbox.isChecked() !== shouldBeChecked) {
        await checkbox.click();
      }
    }
    await this.page.getByTestId("campaign-send-button").click();
    await expect(this.page.getByTestId("campaign-card-policy-renewal-may-2026")).toBeVisible();
    await expect(this.page.getByTestId("campaign-status-policy-renewal-may-2026")).toContainText("Sent");
  }

  async attemptCampaignWithoutRecipients() {
    await this.page.getByTestId("campaign-template-select").selectOption("policy-renewal-notice");
    for (const customerId of ["cust-001", "cust-002", "cust-003", "cust-004"] as CustomerId[]) {
      const checkbox = this.page.getByTestId(`customer-checkbox-${customerId}`);
      if (await checkbox.isChecked()) {
        await checkbox.click();
      }
    }
    await this.page.getByTestId("campaign-send-button").click();
    await expect(this.page.getByTestId("campaigns-empty-state")).toContainText("No campaigns");
  }

  async expectCampaignRecipients(count: number) {
    await expect(this.page.getByTestId("campaign-card-policy-renewal-may-2026")).toContainText(`Recipients: ${count}`);
  }

  async expectCampaignDetails() {
    await this.page.getByTestId("campaign-details-policy-renewal-may-2026").click();
    await expect(this.page.getByTestId("campaign-details-policy-renewal-may-2026")).toContainText("Customer preference based routing");
    await expect(this.page.getByTestId("campaign-details-policy-renewal-may-2026")).toContainText("Archive records");
  }

  async openArchive() {
    await this.page.getByTestId("nav-archive").click();
    await expect(this.page.getByTestId("archive-page")).toBeVisible();
  }

  async expectArchiveEvidence() {
    await expect(this.page.getByTestId("archive-record-avery-brooks")).toContainText("Email");
    await expect(this.page.getByTestId("archive-record-maya-chen")).toContainText("SMS");
    await expect(this.page.getByTestId("archive-record-nora-singh")).toContainText("Portal");
    await expect(this.page.getByTestId("archive-record-elliot-ward")).toContainText("Print");
  }

  async expectArchiveEvidenceForSelectedCustomers() {
    await expect(this.page.getByTestId("archive-record-avery-brooks")).toContainText("Email");
    await expect(this.page.getByTestId("archive-record-maya-chen")).toContainText("SMS");
    await expect(this.page.getByTestId("archive-record-nora-singh")).toHaveCount(0);
    await expect(this.page.getByTestId("archive-record-elliot-ward")).toHaveCount(0);
  }

  async expectArchiveInitialEmptyState() {
    await expect(this.page.getByTestId("archive-initial-empty-state")).toContainText("No communication evidence");
  }

  async expectArchiveSearchWorks() {
    await this.page.getByTestId("archive-search-input").fill("Maya");
    await expect(this.page.getByTestId("archive-record-maya-chen")).toBeVisible();
    await expect(this.page.getByTestId("archive-record-avery-brooks")).toHaveCount(0);

    await this.page.getByTestId("archive-search-input").fill("FAX");
    await expect(this.page.getByTestId("archive-empty-state")).toContainText("No archive records");
  }

  async expectArchiveSearchByPolicyNumber() {
    await this.page.getByTestId("archive-search-input").fill("POL-33810");
    await expect(this.page.getByTestId("archive-record-nora-singh")).toContainText("Portal");
    await expect(this.page.getByTestId("archive-record-maya-chen")).toHaveCount(0);
  }

  async expectArchiveSearchByCampaignChannelStatusAndTrimmedCase() {
    await this.page.getByTestId("archive-search-input").fill("policy renewal may");
    await expect(this.page.getByTestId("archive-record-avery-brooks")).toBeVisible();
    await expect(this.page.getByTestId("archive-record-elliot-ward")).toBeVisible();

    await this.page.getByTestId("archive-search-input").fill("  portal  ");
    await expect(this.page.getByTestId("archive-record-nora-singh")).toContainText("Portal");
    await expect(this.page.getByTestId("archive-record-maya-chen")).toHaveCount(0);
    await expect(this.page.getByTestId("channel-summary")).toContainText("Portal: 1");

    await this.page.getByTestId("archive-search-input").fill("sent");
    await expect(this.page.getByTestId("channel-summary")).toContainText("Email: 1");
    await expect(this.page.getByTestId("channel-summary")).toContainText("SMS: 1");
    await expect(this.page.getByTestId("channel-summary")).toContainText("Portal: 1");
    await expect(this.page.getByTestId("channel-summary")).toContainText("Print: 1");

    await this.page.getByTestId("archive-search-input").fill("");
    await this.expectArchiveEvidence();
  }

  async openDashboard() {
    await this.page.getByTestId("nav-dashboard").click();
    await expect(this.page.getByTestId("dashboard-page")).toBeVisible();
  }

  async expectDashboardMetrics(pending: number, approved: number, sent: number, archive: number) {
    await expect(this.page.getByTestId("metric-pending-templates")).toContainText(String(pending));
    await expect(this.page.getByTestId("metric-approved-templates")).toContainText(String(approved));
    await expect(this.page.getByTestId("metric-sent-campaigns")).toContainText(String(sent));
    await expect(this.page.getByTestId("metric-archive-records")).toContainText(String(archive));
  }

  async expectDashboardEvidence() {
    await expect(this.page.getByTestId("metric-approved-templates")).toContainText("1");
    await expect(this.page.getByTestId("metric-sent-campaigns")).toContainText("1");
    await expect(this.page.getByTestId("metric-archive-records")).toContainText("4");
    await expect(this.page.getByTestId("audit-trail")).toContainText("Campaign Policy Renewal May 2026 sent to 4 customers");
  }

  async expectAuditTrailContainsWorkflowInNewestFirstOrder() {
    const audit = this.page.getByTestId("audit-trail");
    await expect(audit).toContainText("Comms Manager signed in");
    await expect(audit).toContainText("Template Policy Renewal Notice created as draft");
    await expect(audit).toContainText("Template Policy Renewal Notice moved to Pending Approval");
    await expect(audit).toContainText("Template Policy Renewal Notice moved to Approved");
    await expect(audit).toContainText("Campaign Policy Renewal May 2026 sent to 4 customers");

    const text = await audit.innerText();
    expect(text.indexOf("Campaign Policy Renewal May 2026 sent to 4 customers")).toBeLessThan(text.indexOf("Template Policy Renewal Notice moved to Approved"));
    expect(text.indexOf("Template Policy Renewal Notice moved to Approved")).toBeLessThan(text.indexOf("Template Policy Renewal Notice moved to Pending Approval"));
  }

  async openCustomers() {
    await this.page.getByTestId("nav-customers").click();
    await expect(this.page.getByTestId("customers-page")).toBeVisible();
  }

  async expectCustomersPageData() {
    await expect(this.page.getByTestId("customer-row-cust-001")).toContainText("Avery Brooks");
    await expect(this.page.getByTestId("customer-row-cust-001")).toContainText("POL-10491");
    await expect(this.page.getByTestId("customer-row-cust-001")).toContainText("Email");
    await expect(this.page.getByTestId("customer-row-cust-002")).toContainText("SMS");
    await expect(this.page.getByTestId("customer-row-cust-003")).toContainText("Portal");
    await expect(this.page.getByTestId("customer-row-cust-004")).toContainText("Print");
  }

  async openInbox() {
    await this.page.getByTestId("nav-inbox").click();
    await expect(this.page.getByTestId("inbox-page")).toBeVisible();
  }

  async expectInboxEmptyState() {
    await expect(this.page.getByTestId("inbox-page")).toContainText("No inbound messages require action");
  }
}
