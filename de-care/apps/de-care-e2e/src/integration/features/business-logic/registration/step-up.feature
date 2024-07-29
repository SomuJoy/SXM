Feature: Registration step up feature

    Scenario: Registration step up feature
        Given a customer is redirected from BAU with an existing subscription
        When the customer verifies their account with account number
        Then the customer can continue to the registration flow