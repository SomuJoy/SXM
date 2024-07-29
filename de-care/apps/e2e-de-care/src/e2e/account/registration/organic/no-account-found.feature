@onboarding
Feature: Account Registration Organic (No Account Found)

    Scenario: Customer should get to device lookup step when flepz lookup has no results
        When a user visits the registration page and submits lookup data that results in no account found
        Then they should land on the device lookup page
