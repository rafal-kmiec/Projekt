import { expect, type Page } from "@playwright/test";

type Username = "comms_manager" | "compliance_reviewer";

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

  async attemptInvalidLogin() {
    await this.page.getByTestId("username-input").fill("unknown_user");
    await this.page.getByTestId("password-input").fill("wrong-password");
    await this.page.getByTestId("login-submit").click();
    await expect(this.page.getByTestId("login-error")).toContainText("Invalid credentials");
    await expect(this.page.getByTestId("login-page")).toBeVisible();
  }

  async logout() {
    await this.page.getByTestId("logout-button").click();
    await expect(this.page.getByTestId("login-page")).toBeVisible();
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

  async openCampaigns() {
    await this.page.getByTestId("nav-campaigns").click();
    await expect(this.page.getByTestId("campaigns-page")).toBeVisible();
  }

  async expectCampaignRequiresApprovedTemplate() {
    await expect(this.page.getByTestId("campaign-no-template-warning")).toContainText("approved template is required");
    await expect(this.page.getByTestId("campaign-send-button")).toBeDisabled();
  }

  async sendPolicyRenewalCampaign() {
    await this.page.getByTestId("campaign-template-select").selectOption("policy-renewal-notice");
    await this.page.getByTestId("campaign-send-button").click();
    await expect(this.page.getByTestId("campaign-card-policy-renewal-may-2026")).toBeVisible();
    await expect(this.page.getByTestId("campaign-status-policy-renewal-may-2026")).toContainText("Sent");
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

  async expectArchiveSearchWorks() {
    await this.page.getByTestId("archive-search-input").fill("Maya");
    await expect(this.page.getByTestId("archive-record-maya-chen")).toBeVisible();
    await expect(this.page.getByTestId("archive-record-avery-brooks")).toHaveCount(0);

    await this.page.getByTestId("archive-search-input").fill("FAX");
    await expect(this.page.getByTestId("archive-empty-state")).toContainText("No archive records");
  }

  async openDashboard() {
    await this.page.getByTestId("nav-dashboard").click();
    await expect(this.page.getByTestId("dashboard-page")).toBeVisible();
  }

  async expectDashboardEvidence() {
    await expect(this.page.getByTestId("metric-approved-templates")).toContainText("1");
    await expect(this.page.getByTestId("metric-sent-campaigns")).toContainText("1");
    await expect(this.page.getByTestId("metric-archive-records")).toContainText("4");
    await expect(this.page.getByTestId("audit-trail")).toContainText("Campaign Policy Renewal May 2026 sent to 4 customers");
  }
}
