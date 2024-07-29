@checkoutSatellite
Feature: Checkout Satellite Plan Organic Accordion (legacy)
    Scenario: Experience loads correct offer for 6FOR30SELECT
        When a customer visits the page with the program code 6FOR30SELECT
        Then they should be presented with the correct offer

    Scenario: Can complete checkout using existing radio id
        When a customer visits the page with the program code 6FOR30SELECT
        When they go through the organic satellite purchase steps using an existing radio id
        Then they should land on the confirmation page

    Scenario: Can complete checkout using a closed radio id
        When a customer visits the page with the program code 6FOR30SELECT
        When they go through the organic satellite purchase steps using a closed radio id
        Then they should land on the confirmation page

    Scenario: Can complete checkout using flepz data
        When a customer visits the page with the program code 6FOR30SELECT
        When they go through the organic satellite purchase steps using FLEPZ data for an account without an existing self paid subscription
        Then they should land on the confirmation page

    Scenario: Can complete checkout using VIN
        When a customer visits the page with the program code 6FOR30SELECT
        When they go through the organic satellite purchase steps using VIN data for a closed radio
        Then they should land on the confirmation page

    Scenario: Can complete checkout using license plate
        When a customer visits the page with the program code 6FOR30SELECT
        When they go through the organic satellite purchase steps using license plate data for a closed radio
        Then they should land on the confirmation page
