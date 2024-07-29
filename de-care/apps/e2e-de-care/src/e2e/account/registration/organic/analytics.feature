@onboarding
Feature: Account Registration Organic (Analytics)

    Scenario: Analytics event for username in use from credentials form
        When a user visits the registration page and gets to the credentials step
        Then they submit the credentials form with empty field values
        Then analytics events should exist for invalid username and password
        Then they submit the credentials form with a username that is in use
        Then an analytics event should exist for the username in use result
