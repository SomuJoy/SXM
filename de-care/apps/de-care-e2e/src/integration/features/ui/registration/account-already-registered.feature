Feature: Registration account already registered

    Scenario: Registration account already registered
        Given a customer enters the registration flow
        When the customer fills out their information and submits
        And the account is found and already registered
        Then the user is presented the account already registered ui