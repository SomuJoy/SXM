Feature: Checkout Streaming Plan Targeted

    Scenario: Customer not eligible for original offer
        Given a customer goes through the targeted streaming purchase steps
        When the customer gets to the review and submit step
        And clicks on the continue button
        Then they should be presented with the overlay for finding another offer
        And the selected offer should change to the fallback offer found
        Then they should be able to successfully complete their purchase

    Scenario: Customer is eligible for original offer
        Given a customer goes through the targeted streaming purchase steps
        When the customer gets to the review and submit step
        And clicks on the payment confirmation button
        Then they should be able to successfully complete their purchase

    Scenario: Customer is able to register at the end of subscribing without 2FA
        Given a customer goes through the targeted streaming purchase steps
        And clicks on the payment confirmation button
        Then they should be able to successfully complete their purchase
        And Register their account on the confirmation page

    Scenario: Customer is able to register at the end of subscribing with 2FA
        Given a customer goes through the targeted streaming purchase steps
        And clicks on the payment confirmation button
        Then they should be able to successfully complete their purchase even though 2FA required
        And Register their account on the confirmation page
        Then authenticate via two-factor authentication
