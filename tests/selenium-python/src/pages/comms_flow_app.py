from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait


class CommsFlowApp:
    def __init__(self, driver, base_url):
        self.driver = driver
        self.base_url = base_url
        self.wait = WebDriverWait(driver, 10)

    def open(self):
        self.driver.get(self.base_url)
        self.wait_for_test_id("login-page")
        return self

    def reset_state(self):
        self.driver.get(self.base_url)
        self.driver.execute_script("localStorage.clear();")
        self.driver.refresh()
        self.wait_for_test_id("login-page")
        return self

    def login_as(self, username, password="commsflow123"):
        self.type_by_test_id("username-input", username)
        self.type_by_test_id("password-input", password)
        self.click_by_test_id("login-submit")
        return self

    def expect_invalid_login_error(self):
        assert "Invalid credentials" in self.find_by_test_id("login-error").text
        assert self.find_by_test_id("login-page").is_displayed()
        return self

    def expect_manager_access_profile(self):
        assert "Comms Manager" in self.find_by_test_id("access-profile").text
        permissions = self.find_by_test_id("permission-list").text
        assert "Create templates" in permissions
        assert "Send campaigns" in permissions
        return self

    def logout(self):
        self.click_by_test_id("logout-button")
        self.wait_for_test_id("login-page")
        return self

    def open_templates(self):
        self.click_by_test_id("nav-templates")
        self.wait_for_test_id("templates-page")
        return self

    def create_template(self, name="Policy Renewal Notice"):
        self.type_by_test_id("template-name-input", name)
        self.click_by_test_id("template-create-button")
        self.wait_for_test_id("template-card-policy-renewal-notice")
        return self

    def expect_templates_empty_state(self):
        assert "No communication templates" in self.find_by_test_id("templates-empty-state").text
        return self

    def expect_template_details(self):
        self.click_by_test_id("template-details-policy-renewal-notice")
        details = self.find_by_test_id("template-details-policy-renewal-notice").text
        assert "Compliance approval required" in details
        assert "Email, SMS, Portal, Print" in details
        return self

    def submit_template_for_approval(self):
        self.click_by_test_id("submit-template-policy-renewal-notice")
        self.wait_for_text("template-status-policy-renewal-notice", "Pending Approval")
        return self

    def expect_manager_cannot_approve_pending_template(self):
        assert "Approval is restricted" in self.find_by_test_id("manager-approval-blocked-policy-renewal-notice").text
        assert not self.has_test_id("approve-template-policy-renewal-notice")
        return self

    def expect_reviewer_cannot_create_template(self):
        assert "Template creation restricted" in self.find_by_test_id("template-permission-note").text
        assert not self.has_test_id("template-form")
        return self

    def approve_template(self):
        self.click_by_test_id("approve-template-policy-renewal-notice")
        self.wait_for_text("template-status-policy-renewal-notice", "Approved")
        return self

    def open_campaigns(self):
        self.click_by_test_id("nav-campaigns")
        self.wait_for_test_id("campaigns-page")
        return self

    def expect_campaign_requires_approved_template(self):
        assert "approved template is required" in self.find_by_test_id("campaign-no-template-warning").text
        assert self.find_by_test_id("campaign-send-button").get_attribute("disabled") is not None
        return self

    def expect_campaigns_empty_state(self):
        assert "No campaigns" in self.find_by_test_id("campaigns-empty-state").text
        return self

    def send_policy_renewal_campaign(self):
        Select(self.find_by_test_id("campaign-template-select")).select_by_value("policy-renewal-notice")
        self.click_by_test_id("campaign-send-button")
        self.wait_for_test_id("campaign-card-policy-renewal-may-2026")
        self.wait_for_text("campaign-status-policy-renewal-may-2026", "Sent")
        return self

    def expect_campaign_details(self):
        self.click_by_test_id("campaign-details-policy-renewal-may-2026")
        details = self.find_by_test_id("campaign-details-policy-renewal-may-2026").text
        assert "Customer preference based routing" in details
        assert "Archive records" in details
        return self

    def open_archive(self):
        self.click_by_test_id("nav-archive")
        self.wait_for_test_id("archive-page")
        return self

    def expect_archive_evidence(self):
        assert "Email" in self.find_by_test_id("archive-record-avery-brooks").text
        assert "SMS" in self.find_by_test_id("archive-record-maya-chen").text
        assert "Portal" in self.find_by_test_id("archive-record-nora-singh").text
        assert "Print" in self.find_by_test_id("archive-record-elliot-ward").text
        return self

    def expect_archive_initial_empty_state(self):
        assert "No communication evidence" in self.find_by_test_id("archive-initial-empty-state").text
        return self

    def expect_archive_search_works(self):
        self.type_by_test_id("archive-search-input", "Maya")
        assert self.find_by_test_id("archive-record-maya-chen").is_displayed()
        assert not self.has_test_id("archive-record-avery-brooks")
        self.type_by_test_id("archive-search-input", "FAX")
        assert "No archive records" in self.find_by_test_id("archive-empty-state").text
        return self

    def expect_archive_search_by_policy_number(self):
        self.type_by_test_id("archive-search-input", "POL-33810")
        assert "Portal" in self.find_by_test_id("archive-record-nora-singh").text
        assert not self.has_test_id("archive-record-maya-chen")
        return self

    def open_dashboard(self):
        self.click_by_test_id("nav-dashboard")
        self.wait_for_test_id("dashboard-page")
        return self

    def expect_dashboard_evidence(self):
        assert "1" in self.find_by_test_id("metric-approved-templates").text
        assert "1" in self.find_by_test_id("metric-sent-campaigns").text
        assert "4" in self.find_by_test_id("metric-archive-records").text
        assert "Campaign Policy Renewal May 2026 sent to 4 customers" in self.find_by_test_id("audit-trail").text
        return self

    def click_by_test_id(self, test_id):
        self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, self.selector(test_id)))).click()

    def type_by_test_id(self, test_id, value):
        element = self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, self.selector(test_id))))
        element.clear()
        element.send_keys(value)

    def find_by_test_id(self, test_id):
        return self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, self.selector(test_id))))

    def wait_for_test_id(self, test_id):
        return self.find_by_test_id(test_id)

    def wait_for_text(self, test_id, text):
        self.wait.until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, self.selector(test_id)), text))

    def has_test_id(self, test_id):
        return bool(self.driver.find_elements(By.CSS_SELECTOR, self.selector(test_id)))

    @staticmethod
    def selector(test_id):
        return f"[data-testid='{test_id}']"

