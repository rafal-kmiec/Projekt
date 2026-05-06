import pytest

from pages.comms_flow_app import CommsFlowApp


@pytest.mark.regression
def test_template_lifecycle_preserves_metadata_and_role_approval_rules(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    app.login_as("comms_manager")
    app.open_templates()
    app.create_template()
    app.expect_template_draft_metadata()
    app.expect_duplicate_template_is_ignored()
    app.expect_template_details()
    app.submit_template_for_approval()
    app.expect_manager_cannot_approve_pending_template()
    app.logout()

    app.login_as("compliance_reviewer")
    app.open_templates()
    app.approve_template()
    app.expect_approve_button_is_hidden_after_approval()
