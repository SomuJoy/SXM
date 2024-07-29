@onboarding
Feature: Account Registration Organic (Accounts Found)

    Scenario: Customer should get to accounts found step when flepz lookup has multiple results
        When a user visits the registration page and submits lookup data that results in multiple account found
        Then they should land on the accounts found results page
        Then there should be multiple account results displayed
