@retain
Feature: Update a payment

    Scenario: Credit Card and Next payment amount
        Given a customer has CC as payment method and only next payment amount
        When the customer enters the update-payment experience
        Then the customer should be able to update payment


    Scenario: Credit Card and Current balance due
        Given a customer has CC as payment method and only current balance due
        When the customer enters the update-payment experience
        Then the customer should be able to update payment


    Scenario: Credit Card and Current balance due plus Next payment amount
        Given a customer has CC as payment method and Current Balance plus Next payment amount
        When the customer enters the update-payment experience
        Then the customer should be able to update payment

    Scenario: Credit Card and Suspendended radio
        Given a customer has CC as payment method and Suspended radio
        When the customer enters the update-payment experience
        Then the customer should see the suspended subscriptions alert

    Scenario: Complete Update payment transaction
        Given a customer has CC as payment method
        Then navigates to the update payment experience
        When the customer fills out the form
        Then accepts agreement and clicks on the Submit Paymment button
        Then the experience should navigate to the confirmation page
        Then the customer should see update payment confirmation
