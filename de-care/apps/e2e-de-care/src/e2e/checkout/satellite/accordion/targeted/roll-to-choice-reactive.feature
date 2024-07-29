@checkoutSatellite
Feature: Checkout Satellite Roll To Choice Targeted Accordion
    Scenario: Experience loads offer and change renewal correctly for targeted customer via token
        When a customer visits the satellite accordion targeted flow for roll to choice with a valid token
        Then they should be presented with the roll to choice offer
        # Then they should see the option to change renewal
