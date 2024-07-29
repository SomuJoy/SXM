@checkoutSatellite
Feature: Checkout Satellite Plan Organic Accordion (legacy) (Existing Customer)

    Scenario: Customer with single satellite subscription using radio id lookup
        Given a customer visits the organic satellite purchase flow
        When they use a radio id with a single self pay satellite subscription
        Then they should be presented with the subscription found modal with a single subscription

    Scenario: Customer with single satellite subscription using flepz lookup
        Given a customer visits the organic satellite purchase flow
        When they use flepz data with a single self pay satellite subscription
        Then they should be presented with the subscription found modal with a single subscription

    Scenario: Customer with single satellite subscription using VIN lookup
        Given a customer visits the organic satellite purchase flow
        When they use VIN data with a single self pay satellite subscription
        Then they should be presented with the subscription found modal with a single subscription

    Scenario: Customer with single satellite subscription using license plate lookup
        Given a customer visits the organic satellite purchase flow
        When they use license plate data with a single self pay satellite subscription
        Then they should be presented with the subscription found modal with a single subscription

    Scenario: Customer with multiple satellite subscriptions using flepz lookup
        Given a customer visits the organic satellite purchase flow
        When they use flepz data with a multiple self pay satellite subscriptions
        Then they should be presented with the devices found modal with multiple devices

    Scenario: Customer with multiple satellite subscriptions using flepz lookup can purchase a self pay for a trial
        Given a customer visits the organic satellite purchase flow
        When they use flepz lookup with a self pay satellite subscription and a trial subscription
        Then they should be able to select the trial and purchase a self pay subscription
