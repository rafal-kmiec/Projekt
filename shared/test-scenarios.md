# Test Scenarios

## Smoke

- Comms Manager can sign in.
- Comms Manager can create a `Policy Renewal Notice` template.
- Comms Manager can submit the template for approval.
- Compliance Reviewer can sign in and approve the pending template.
- Comms Manager can send a `Policy Renewal May 2026` campaign using the approved template.
- Archive records are created for Email, SMS, Portal, and Print recipients.
- Archive search filters communication evidence by customer or channel.
- Dashboard metrics reflect approved templates, sent campaigns, and archive records.
- Demo pages expose readable empty states before templates, campaigns, or archive records exist.

## Regression

- Invalid login shows a clear error message.
- Comms Manager lands on Dashboard after login and remains signed in after refresh.
- Compliance Reviewer lands on Templates after login.
- Logged-out users attempting protected routes see the Login page.
- Topbar navigation reaches Dashboard, Customers, Templates, Campaigns, Inbox, and Archive.
- Comms Manager sees create, submit, and send permissions.
- Compliance Reviewer sees approve permission and cannot access template creation.
- Compliance Reviewer cannot create new templates.
- Comms Manager cannot approve templates.
- Template cards preserve draft metadata, version, owner, and approval status.
- Duplicate template creation with the same name does not create another card.
- Approved templates no longer expose the approval action.
- Campaign send is blocked until an approved template is selected.
- Compliance Reviewers cannot send campaigns even when an approved template exists.
- Comms Managers can send campaigns to a selected subset of customers.
- Campaign submission with no selected recipients does not create campaign or archive evidence.
- Managers see approval restrictions on pending templates.
- Reviewers see template creation restrictions.
- Customer preferred channels are preserved in archive records.
- Template and campaign details explain approval policy, routing, and archive evidence.
- Archive search can find records by policy number.
- Archive search can find records by campaign name, channel, status, and case-insensitive trimmed input.
- Clearing archive search restores all archive records.
- Channel summary reflects the currently filtered archive records.
- Dashboard metrics update after pending approval, approval, campaign send, and archive creation.
- Audit trail records login, template, approval, and campaign actions.
- Audit trail shows newer workflow entries before older entries.
- Customers page shows policy numbers and preferred channels for all demo customers.
- Inbox shows an empty state for future inbound messages.

## Future E2E

- Receive an inbound customer response and assign it to a team.
- Upload a document to the archive.
- Search archive by customer, policy number, channel, and campaign.
- Validate role-based navigation and restricted actions.

