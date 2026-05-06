import pytest

from pages.comms_flow_app import CommsFlowApp


@pytest.mark.smoke
def test_invalid_credentials_keep_user_on_login(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    app.login_as("unknown_user", "wrong-password")
    app.expect_invalid_login_error()


@pytest.mark.smoke
def test_role_permissions_protect_template_approval_and_campaign_send(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    app.login_as("comms_manager")
    app.open_templates()
    app.create_template()
    app.submit_template_for_approval()
    app.expect_manager_cannot_approve_pending_template()
    app.open_campaigns()
    app.expect_campaign_requires_approved_template()
    app.logout()

    app.login_as("compliance_reviewer")
    app.open_templates()
    app.expect_reviewer_cannot_create_template()
    app.approve_template()
