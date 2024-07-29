Feature: Registration no account found

    Scenario: Registration no account found
        Given a customer enters the registration flow
        When the customer fills out their information and submits
        And the account is not found
        Then the user should have a chance to lookup their account