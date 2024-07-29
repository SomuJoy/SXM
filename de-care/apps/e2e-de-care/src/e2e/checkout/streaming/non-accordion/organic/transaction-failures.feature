@checkoutDigital
Feature: Checkout Streaming Plan Organic (Transaction Failures)

    Scenario: Customer should get a credit card error for expired cc on the payment step after transaction submission
        When a customer goes through the organic streaming purchase steps with a valid program code and invalid credit card expiration
        Then they should be taken back to the payment step and shown an error message in the credit card section

    Scenario: Customer should get a credit card error for fraud on the payment step after transaction submission
        When a customer goes through the organic streaming purchase steps with a valid program code and invalid credit card
        Then they should be taken back to the payment step and shown an error message in the credit card section

    Scenario: Customer should get a general system error on the payment step after transaction submission
        When a customer goes through the organic streaming purchase steps with a valid program code and a system error occurs on purchase transaction
        Then they should be taken back to the payment step and shown a general system error message in the credit card section

    Scenario: Customer should get a password error on the credentials step after transaction submission
        When a customer goes through the organic streaming purchase steps with a valid program code and a password error occurs on purchase transaction
        Then they should be taken back to the credentials step and shown a password error message

    Scenario: Customer should get a new transaction id on credit card error
        When a customer goes through the organic streaming purchase steps with a valid program code and a new transaction id and invalid credit card
        Then a new transaction id should be generated
