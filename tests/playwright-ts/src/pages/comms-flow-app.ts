import { expect, type Page } from "@playwright/test";

export class CommsFlowApp {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/");
    await expect(this.page.getByTestId("login-page")).toBeVisible();
  }

  async loginAs(username: "comms_manager" | "compliance_reviewer") {
    await this.page.getByTestId("username-input").fill(username);
    await this.page.getByTestId("password-input").fill("commsflow123");
    await this.page.getByTestId("login-submit").click();
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

  async approveTemplate() {
    await this.page.getByTestId("approve-template-policy-renewal-notice").click();
    await expect(this.page.getByTestId("template-status-policy-renewal-notice")).toContainText("Approved");
  }

  async openCampaigns() {
    await this.page.getByTestId("nav-campaigns").click();
    await expect(this.page.getByTestId("campaigns-page")).toBeVisible();
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
