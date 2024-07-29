@checkoutSatellite
Feature: Checkout Satellite Plan Organic Accordion (legacy) (Transaction Failures)

    Scenario: Customer should get a credit card error for expired cc on the payment step after transaction submission for existing radio
        When a customer visits the organic satellite purchase flow 
        Then they go through the organic satellite purchase steps with an invalid credit card expiration for existing radio
        Then they should be taken back to the payment step and shown an error message in the credit card section
        Then they should be able to complete the transaction if they update to a valid credit card
        Then they should land on the confirmation page

    Scenario: Customer should get a general system error on the payment step after transaction submission for existing radio
        When a customer visits the organic satellite purchase flow
        Then they go through the organic satellite purchase steps and a system error occurs on purchase transaction for existing radio
        Then they should be taken back to the lookup step

    Scenario: Customer should get a credit card error for expired cc on the payment step after transaction submission for closed radio
        When a customer visits the organic satellite purchase flow 
        Then they go through the organic satellite purchase steps with an invalid credit card expiration for closed radio
        Then they should be taken back to the payment step and shown an error message in the credit card section

    Scenario: Customer should get a general system error on the payment step after transaction submission for closed radio
        When a customer visits the organic satellite purchase flow
        Then they go through the organic satellite purchase steps and a system error occurs on purchase transaction for closed radio
        Then they should be taken back to the lookup step
