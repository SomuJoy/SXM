@retain
Feature: Negative scenarios to purchase a new plan in the Cancel Subscription flow

    Scenario: Customer enters an invalid credit card 
        When a logged in customer enters to the Cancel Subscription flow
        Then completes all steps to get a new subscription
        Then enters an invalid credit card in the Payment Info section
        Then accepts and completes the order
        Then experience should display an error message
        Then the credit card number input should be masked
