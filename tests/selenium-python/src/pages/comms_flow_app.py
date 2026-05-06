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

    def login_as(self, username):
        self.type_by_test_id("username-input", username)
        self.type_by_test_id("password-input", "commsflow123")
        self.click_by_test_id("login-submit")
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

    def submit_template_for_approval(self):
        self.click_by_test_id("submit-template-policy-renewal-notice")
        self.wait_for_text("template-status-policy-renewal-notice", "Pending Approval")
        return self

    def approve_template(self):
        self.click_by_test_id("approve-template-policy-renewal-notice")
        self.wait_for_text("template-status-policy-renewal-notice", "Approved")
        return self

    def open_campaigns(self):
        self.click_by_test_id("nav-campaigns")
        self.wait_for_test_id("campaigns-page")
        return self

    def send_policy_renewal_campaign(self):
        Select(self.find_by_test_id("campaign-template-select")).select_by_value("policy-renewal-notice")
        self.click_by_test_id("campaign-send-button")
        self.wait_for_test_id("campaign-card-policy-renewal-may-2026")
        self.wait_for_text("campaign-status-policy-renewal-may-2026", "Sent")
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

    @staticmethod
    def selector(test_id):
        return f"[data-testid='{test_id}']"
