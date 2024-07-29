@checkoutSatellite
Feature: Checkout Satellite Plan Organic Non-Accordion

    Scenario: Experience loads offer correctly for default offer
        Given a customer visits the satellite organic flow with no program code
        Then they should be presented with a default offer

    Scenario: Experience presents device lookup options
        Given a customer visits the satellite organic flow with no program code
        When they click continue on the offer presentment page
        Then they should be presented with device lookup options

    Scenario: Can start on device lookup options page
        Given a customer visits the satellite organic flow device lookup page with no program code
        Then they should be presented with device lookup options