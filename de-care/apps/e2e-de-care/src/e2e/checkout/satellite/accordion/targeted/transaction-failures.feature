@checkoutSatellite
Feature: Checkout Satellite Plan Targeted Accordion (legacy) (Transaction Failures)

    Scenario: Customer should get a credit card error for expired cc on the payment step after transaction submission for closed radio
        When a customer visits the satellite accordion targeted flow with a token for a self pay promo and closed radio
        Then they go through the targeted satellite purchase steps with an invalid credit card expiration for closed radio
        Then they should be taken back to the payment step and shown an error message in the credit card section
        Then they should be able to complete the transaction if they update to a valid credit card
        Then they should land on the confirmation page

    Scenario: Customer should get a general system error on the payment step after transaction submission for closed radio
        When a customer visits the satellite accordion targeted flow with a token for a self pay promo and closed radio
        Then they go through the targeted satellite purchase steps and a system error occurs on purchase transaction for closed radio
        Then they should be taken back to the payment step and shown an auth error message in the credit card section
