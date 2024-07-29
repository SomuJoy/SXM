@checkoutSatellite
Feature: Checkout Satellite Zero Cost

    Scenario: Can complete zero cost checkout
        When a customer visits the page with a valid promo code
        Then they successfully go through the purchase steps
        Then they should be presented with the device activation page
        Then they should be able to send the refresh signal and register the account

    Scenario: Successful device lookup with no vehicle displays radio id text
        When a customer visits the page with a valid promo code
        Then they enter in valid device info that qualifies for the offer and does not have vehicle info
        Then they should be presented with text copy that includes the radio id
