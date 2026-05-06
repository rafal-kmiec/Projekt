import pytest

from pages.comms_flow_app import CommsFlowApp

HTML_PAYLOAD = "<img src=x onerror=alert(1)>"
CAMPAIGN_PAYLOAD = "<svg onload=alert(1)>Security Notice</svg>"


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
def test_protected_routes_require_active_authenticated_user(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    app.expect_protected_routes_require_login()
    app.login_as("comms_manager")
    app.open_archive()
    app.expect_direct_route_after_logout_requires_login("/archive")


@pytest.mark.regression
def test_local_storage_tampering_falls_back_to_canonical_account_permissions(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    app.expect_corrupted_storage_falls_back_to_login()
    app.expect_unknown_stored_user_falls_back_to_login()
    app.expect_tampered_manager_permissions_are_canonical()


@pytest.mark.regression
def test_role_based_action_guardrails_block_restricted_workflow_mutations(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    app.login_as("comms_manager")
    app.open_templates()
    app.create_template()
    app.submit_template_for_approval()
    app.expect_manager_cannot_approve_pending_template()
    app.open_dashboard()
    app.expect_dashboard_metrics(1, 0, 0, 0)
    app.logout()

    app.login_as("compliance_reviewer")
    app.open_templates()
    app.expect_reviewer_cannot_create_template()
    app.approve_template()
    app.open_campaigns()
    app.expect_reviewer_cannot_send_campaign()
    app.open_archive()
    app.expect_archive_initial_empty_state()


@pytest.mark.regression
def test_user_controlled_text_is_rendered_without_executing_script_payloads(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    app.login_as("comms_manager")
    app.open_templates()
    app.expect_template_name_payload_is_rendered_as_text(HTML_PAYLOAD)
    app.create_template()
    app.submit_template_for_approval()
    app.logout()

    app.login_as("compliance_reviewer")
    app.open_templates()
    app.approve_template()
    app.logout()

    app.login_as("comms_manager")
    app.open_campaigns()
    app.send_campaign_with_name(CAMPAIGN_PAYLOAD)
    app.open_archive()
    app.expect_archive_search_payload_is_safe(HTML_PAYLOAD)


@pytest.mark.regression
def test_authenticated_pages_and_persisted_state_do_not_expose_demo_passwords(driver, base_url):
    app = CommsFlowApp(driver, base_url).open().reset_state()

    app.login_as("comms_manager")
    app.expect_password_is_not_exposed_after_login()
    app.logout()

    create_approved_template(app)
    app.logout()
    app.login_as("comms_manager")
    app.open_campaigns()
    app.send_policy_renewal_campaign()
    app.open_dashboard()
    app.expect_audit_trail_contains_workflow_in_newest_first_order()
