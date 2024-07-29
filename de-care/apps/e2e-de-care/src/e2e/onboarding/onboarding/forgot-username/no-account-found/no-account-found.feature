@onboarding
Feature: Account Registration Organic (No Account Found)

    Scenario: Customer should be redirected to account not found when it has no results
        When a user visits the forgot user name page and submits data that results in no account found
        Then they should land on the account not found page
