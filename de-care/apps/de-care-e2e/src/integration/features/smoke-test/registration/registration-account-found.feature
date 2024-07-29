Feature: Registration account found successful

    Scenario: Registration account found and successful checkout
        Given a customer enters the registration flow
        When the customer fills out their information and submits
        And the account is found
        Then the user can successfully complete registration and checkout