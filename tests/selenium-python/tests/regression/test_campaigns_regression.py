import pytest

from pages.comms_flow_app import CommsFlowApp


def create_approved_template(app):
    app.login_as("comms_manager")
    app.open_templates()
    app.create_template()
    app.submit_template_for_approval()
    app.logout()

    app.login_as("compliance_reviewer")
    app.open_templates()
    app.approve_template()


@pytest.mark.regression
def test_reviewer_cannot_send_campaign_even_with_approved_template(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    create_approved_template(app)
    app.open_campaigns()
    app.expect_reviewer_cannot_send_campaign()
    app.expect_campaigns_empty_state()


@pytest.mark.regression
def test_manager_can_send_campaign_to_selected_customers_only(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    create_approved_template(app)
    app.logout()

    app.login_as("comms_manager")
    app.open_campaigns()
    app.send_policy_renewal_campaign_to_customers(["cust-001", "cust-002"])
    app.expect_campaign_recipients(2)
    app.expect_campaign_details()
    app.open_archive()
    app.expect_archive_evidence_for_selected_customers()
    app.open_dashboard()
    app.expect_dashboard_metrics(0, 1, 1, 2)


@pytest.mark.regression
def test_campaign_without_recipients_does_not_create_delivery_evidence(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    create_approved_template(app)
    app.logout()

    app.login_as("comms_manager")
    app.open_campaigns()
    app.attempt_campaign_without_recipients()
    app.open_archive()
    app.expect_archive_initial_empty_state()
    app.open_dashboard()
    app.expect_dashboard_metrics(0, 1, 0, 0)
