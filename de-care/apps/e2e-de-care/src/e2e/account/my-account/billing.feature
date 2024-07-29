@myAccount
Feature: My Account
    Scenario: Billing loads
        Given a customer visits the my account experience while logged in
        When they navigate to the billing section
        Then they should be routed to the billing experience
    Scenario: Billing loads no data
        Given a customer visits the my account experience while logged in
        When they navigate to the billing section with an account with no billing data
        Then they should see a message that says they have no data
