@myAccount
Feature: My Account

    Scenario: Account Info loads
        Given a customer visits the my account experience while logged in
        When they navigate to the account info section
        Then they should be routed to the account info experience

    Scenario: Edit Account Login loads
        Given a customer visits the my account experience while logged in
        When they navigate to the edit account login section
        Then they should be routed to the edit account login experience

    Scenario: Edit Billing Address loads
        Given a customer visits the my account experience while logged in
        When they navigate to the edit billing address section
        Then they should be routed to the edit billing address experience
