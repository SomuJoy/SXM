@checkoutSatellite
Feature: Checkout Satellite Plan Targeted Accordion
    Scenario: Experience loads self pay promo correctly for targeted customer via radio id and account number
        When a customer visits the satellite accordion targeted flow for a self pay promo with a valid radio id and account number
        Then they should be presented with the correct offer
        Then they should see their device information

    Scenario: Experience loads self pay promo correctly for targeted customer via radio id and account number and upcode
        When a customer visits the satellite accordion targeted flow for a self pay promo with a valid radio id and account number and upcode
        Then they should be presented with upsell offers

    Scenario: Experience loads self pay promo correctly for targeted customer with a closed radio via token
        When a customer visits the satellite accordion targeted flow with a token for a self pay promo
        Then they should be presented with the correct offer
        Then they should see their device information

    Scenario: Can complete checkout with a closed radio via token
        When a customer visits the satellite accordion targeted flow with a token for a self pay promo
        Then they go through the targeted satellite purchase steps
        Then they should land on the confirmation page
