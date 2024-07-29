@myAccount
Feature: Do Not Call

    Scenario: Sign up for do not call
        When a customer visits the do not call experience and successfully completes the transaction
        Then they should see the thank you message
