import pytest

from pages.comms_flow_app import CommsFlowApp


@pytest.mark.regression
def test_auth_session_and_protected_routing_stay_consistent(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    app.login_as("comms_manager")
    app.expect_manager_lands_on_dashboard()
    app.expect_session_persists_after_refresh()
    app.logout()
    app.open_protected_archive_while_logged_out()

    app.login_as("compliance_reviewer")
    app.expect_reviewer_lands_on_templates()


@pytest.mark.regression
def test_role_profile_and_topbar_navigation_expose_demo_workspace(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    app.login_as("comms_manager")
    app.expect_manager_access_profile()
    app.expect_topbar_navigation()


@pytest.mark.regression
def test_reviewer_permissions_are_visible_and_block_template_creation(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    app.login_as("compliance_reviewer")
    app.expect_reviewer_lands_on_templates()
    app.expect_reviewer_access_profile()
    app.open_templates()
    app.expect_reviewer_cannot_create_template()
