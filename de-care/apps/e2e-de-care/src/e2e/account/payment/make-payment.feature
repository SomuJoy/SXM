@retain
Feature: Make a payment

    Scenario: Credit Card and Next payment amount
        Given a customer has CC as payment method and only next payment amount
        When the customer enters the make-payment experience
        Then the customer should not see the Next payment due box
        Then should not see the payment amount selection


    Scenario: Credit Card and Current balance due
        Given a customer has CC as payment method and only current balance due
        When the customer enters the make-payment experience
        Then the customer should see the Current balance due box
        Then should not see the payment amount selection


    Scenario: Credit Card and Current balance due plus Next payment amount
        Given a customer has CC as payment method and Current Balance plus Next payment amount
        When the customer enters the make-payment experience
        Then the customer should see the Current balance due box
        Then not the Next payment amount box
        Then should not see the payment amount selection


    Scenario: Credit Card and Suspendended radio
        Given a customer has CC as payment method and Suspended radio
        When the customer enters the make-payment experience
        Then the customer should see the suspended subscriptions alert
        Then the Total Due Now box
        Then the Reactivation balance accordion


   Scenario: Payment type Invoice
        Given a customer has Invoice as payment method
        When the customer enters the make-payment experience
        Then the customer should see the Payment frequency selection


    Scenario: Complete payment transaction
        Given a customer navigates to the payment experience
        When the customer fills out the form
        Then accepts agreement and clicks on the Submit Paymment button
        Then the experience should navigate to the confirmation page
        

    Scenario: Complete payment transaction with suspended radio
        Given a customer with a suspended radio navigates to the payment experience
        When the customer fills out the form
        Then accepts agreement and clicks on the Submit Paymment button
        Then the experience should navigate to the confirmation page
        Then display the Radio Activation option
