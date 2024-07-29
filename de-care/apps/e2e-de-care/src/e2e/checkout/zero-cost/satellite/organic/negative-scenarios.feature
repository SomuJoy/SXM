@checkoutSatellite
Feature: Checkout Satellite Zero Cost (Negative Scenarios)

    Scenario: Promo code redeemed message for redeemed promo code
        When a customer visits the page with an redeemed promo code
        Then they should be presented with the promo code redeemed page

    Scenario: General error page for invalid promo code
        When a customer visits the page with an invalid promo code
        Then they should be presented with the general error page

    Scenario: General error page for expired promo code
        When a customer visits the page with an expired promo code
        Then they should be presented with the general error page

    Scenario: Device info that does not qualify for the offer
        When a customer visits the page with a valid promo code
        Then they enter in device info that does not qualify for the offer
        Then they should be presented with an error about device not qualifying for offer
