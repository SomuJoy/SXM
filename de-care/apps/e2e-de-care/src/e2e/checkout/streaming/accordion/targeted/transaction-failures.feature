@checkoutDigital
Feature: Checkout Streaming Plan Targeted Legacy (Transaction Failures)

    Scenario: Customer should get a new transaction id on credit card error
        When a customer goes through the legacy targeted streaming purchase steps with a valid program code and a new transaction id and invalid credit card
        Then a new transaction id should be generated
        Then they should be able to complete the transaction if they update to a valid credit card
        Then they should land on the confirmation page
