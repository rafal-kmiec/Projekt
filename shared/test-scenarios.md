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

## Regression

- Invalid login shows a clear error message.
- Compliance Reviewer cannot create new templates.
- Comms Manager cannot approve templates.
- Campaign send is blocked until an approved template is selected.
- Managers see approval restrictions on pending templates.
- Reviewers see template creation restrictions.
- Customer preferred channels are preserved in archive records.
- Audit trail records login, template, approval, and campaign actions.

## Future E2E

- Receive an inbound customer response and assign it to a team.
- Upload a document to the archive.
- Search archive by customer, policy number, channel, and campaign.
- Validate role-based navigation and restricted actions.

