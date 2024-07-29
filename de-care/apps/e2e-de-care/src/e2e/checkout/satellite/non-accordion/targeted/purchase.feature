@checkoutSatellite
Feature: Checkout Satellite Plan Targeted Non-Accordion

    Scenario: Experience loads offer correctly for targeted customer via radio id and account number
        When a customer visits the satellite targeted flow with a valid radio id and account number
        Then they should be presented with the correct offer

    Scenario: Can complete checkout with a radio id and account number
        When a customer visits the satellite targeted flow with a valid radio id and account number
        Then they go through the targeted satellite purchase steps
        Then they should land on the confirmation page
