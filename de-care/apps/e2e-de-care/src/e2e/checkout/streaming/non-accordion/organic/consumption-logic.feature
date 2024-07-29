@checkoutDigital
Feature: Checkout Streaming Plan Organic (Consumption Logic)

    Scenario: Customer should get a fallback offer when consumption logic identifies they are not eligible
        When a customer goes through the organic streaming purchase steps with a valid program code and non-qualifying data
        Then they should be presented with a fallback offer
        Then they should be able to complete the transaction
        Then they should land on the confirmation page
