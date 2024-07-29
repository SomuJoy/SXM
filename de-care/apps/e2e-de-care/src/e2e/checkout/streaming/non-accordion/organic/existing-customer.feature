@checkoutDigital
Feature: Checkout Streaming Plan Organic (Existing Customer)

    Scenario: Customer with single streaming subscription
        When a customer uses an email address that has a single streaming subscription when visiting the page with a valid program code
        Then they should be presented with the subscription found modal and the listen link

    Scenario: Customer with multiple streaming subscription
        When a customer uses an email address that has multiple streaming subscriptions when visiting the page with a valid program code
        Then they should be presented with the subscription found modal and multiple listen links

    Scenario: Customer with single trial subscription
        When a customer uses an email address that has a single trial subscription when visiting the page with a valid program code
        Then they should be presented with the subscription found modal and the subscribe link

    Scenario: Customer with multiple trial subscriptions
        When a customer uses an email address that has multiple trial subscriptions and some with follow ons when visiting the page with a valid program code
        Then they should be presented with the subscription found modal and the subscribe link and listen link
