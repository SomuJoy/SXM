@onboarding
Feature: Account Registration Organic (Negative Scenarios)

    Scenario: Customer should get a general error message after account lookup submission error
        When a user visits the registration page and submits lookup data that results in a general error
        Then they should be shown a general error message

    Scenario: Customer should be able to update info after getting a general error message
        When a user visits the registration page and submits lookup data that results in a general error
        Then they should be shown a general error message
        Then when they update the form with valid info and re-submit
        Then they should land on the device lookup page
