Feature: Forgot Password (Negative Scenarios)

    Scenario: Experience handles account not found
        Given a customer visits the forgot password experience 
        When they submit an email address that is not found
        Then they should land on the account not found page
