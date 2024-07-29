Feature: Trial Roll To Pay

    Scenario: Customer enters roll to pay from RFLZ
        Given a customer enters the RTP streaming flow
        And the customer is eligible
        When the customer fills out the payment info
        Then they can checkout with a new trial subscription
