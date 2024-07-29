Feature: Behavior for lookup by radio id or vin or license plate and existing credentials found

    Background:
        Given a customer visits the streaming onboarding URL
        And they submit the FLEPZ form with no match data

    Scenario: Lookup by radio id success
        When they submit the radio id lookup form with valid data and have existing credentials
        Then they should be navigated to the existing credentials page

    Scenario: Lookup by vin success
        When they submit the vin lookup form with valid data and have existing credentials
        Then they should be navigated to the existing credentials page

    Scenario: Lookup by license plate success
        When they submit the license plate lookup form with valid data and have existing credentials
        Then they should be navigated to the existing credentials page
