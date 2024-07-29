Feature: RTP CHOICE

    Scenario: Trial Activation RTP Choice
        Given the customer visits the url organic
        When they verify their radio ID and select a choice package
        Then they should be able to successfully create an account and checkout