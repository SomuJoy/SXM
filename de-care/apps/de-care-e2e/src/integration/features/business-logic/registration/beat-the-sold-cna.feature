Feature: Registration beat the sold feature

    Scenario: Registration beat the sold feature
        Given a customer enters the registration flow
        When the customer fills out their information and submits
        And the account is not found and the customer looks up their account
        Then the customer sees the CNA page
        And the customer fills out the CNA data
        Then the user can complete the normal registration flow