import pytest

from pages.comms_flow_app import CommsFlowApp


@pytest.mark.regression
def test_demo_surfaces_empty_states_and_manager_permissions(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    app.login_as("comms_manager")
    app.expect_manager_access_profile()
    app.open_templates()
    app.expect_templates_empty_state()
    app.open_campaigns()
    app.expect_campaigns_empty_state()
    app.expect_campaign_requires_approved_template()
    app.open_archive()
    app.expect_archive_initial_empty_state()


@pytest.mark.regression
def test_record_details_policy_search_and_audit_trail_stay_consistent(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    app.login_as("comms_manager")
    app.open_templates()
    app.create_template()
    app.expect_template_details()
    app.submit_template_for_approval()
    app.logout()

    app.login_as("compliance_reviewer")
    app.open_templates()
    app.approve_template()
    app.logout()

    app.login_as("comms_manager")
    app.open_campaigns()
    app.send_policy_renewal_campaign()
    app.expect_campaign_details()
    app.open_archive()
    app.expect_archive_search_by_policy_number()
    app.open_dashboard()
    app.expect_dashboard_evidence()
