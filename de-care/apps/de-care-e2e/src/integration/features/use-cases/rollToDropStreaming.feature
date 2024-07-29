Feature: Roll to Drop Streaming

    Scenario: Purchase with fraud credit card error
        Given I navigate to the URL
        When I fill out the form with fraudulent credit card data
        Then I should see the credit card error message
