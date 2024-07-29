Feature: Checkout Satellite Plan Organic

    Scenario: Customer sucessfully purchases an organic satellite plan
        Given a customer enters the organic satellite flow
        When the user enters their information and complets the flow
        Then the user sucessfully purchases a satellite plan
