@checkoutSatellite
Feature: Checkout Satellite Plan Targeted Non-Accordion (Existing Customer)

    Scenario: Customer with existing self pay subscription
        When a customer visits the targeted satellite purchase experience with a radio id that has an existing self pay subscription
        Then they should be redirected to the active subscription page
