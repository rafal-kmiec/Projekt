import pytest

from pages.comms_flow_app import CommsFlowApp


def complete_approval_flow(app):
    app.login_as("comms_manager")
    app.open_templates()
    app.create_template()
    app.submit_template_for_approval()
    app.open_dashboard()
    app.expect_dashboard_metrics(1, 0, 0, 0)
    app.logout()

    app.login_as("compliance_reviewer")
    app.open_templates()
    app.approve_template()
    app.logout()


@pytest.mark.regression
def test_archive_search_supports_campaign_channel_status_case_and_clearing(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    complete_approval_flow(app)

    app.login_as("comms_manager")
    app.open_campaigns()
    app.send_policy_renewal_campaign()
    app.open_archive()
    app.expect_archive_search_by_campaign_channel_status_and_trimmed_case()


@pytest.mark.regression
def test_dashboard_metrics_and_audit_trail_follow_workflow_timeline(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    app.login_as("comms_manager")
    app.expect_dashboard_metrics(0, 0, 0, 0)
    app.open_templates()
    app.create_template()
    app.submit_template_for_approval()
    app.open_dashboard()
    app.expect_dashboard_metrics(1, 0, 0, 0)
    app.logout()

    app.login_as("compliance_reviewer")
    app.open_templates()
    app.approve_template()
    app.logout()

    app.login_as("comms_manager")
    app.open_dashboard()
    app.expect_dashboard_metrics(0, 1, 0, 0)
    app.open_campaigns()
    app.send_policy_renewal_campaign()
    app.open_dashboard()
    app.expect_dashboard_metrics(0, 1, 1, 4)
    app.expect_audit_trail_contains_workflow_in_newest_first_order()


@pytest.mark.regression
def test_customers_and_inbox_pages_expose_static_demo_evidence(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    app.login_as("comms_manager")
    app.open_customers()
    app.expect_customers_page_data()
    app.open_inbox()
    app.expect_inbox_empty_state()
