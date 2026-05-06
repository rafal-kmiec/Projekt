import pytest

from pages.comms_flow_app import CommsFlowApp


@pytest.mark.smoke
def test_regulated_communication_approval_and_send_flow(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    app.login_as("comms_manager")
    app.open_templates()
    app.create_template()
    app.submit_template_for_approval()
    app.logout()

    app.login_as("compliance_reviewer")
    app.open_templates()
    app.approve_template()
    app.logout()

    app.login_as("comms_manager")
    app.open_campaigns()
    app.send_policy_renewal_campaign()
    app.open_archive()
    app.expect_archive_evidence()
    app.expect_archive_search_works()
    app.open_dashboard()
    app.expect_dashboard_evidence()

