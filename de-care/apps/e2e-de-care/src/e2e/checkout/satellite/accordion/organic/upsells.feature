@checkoutSatellite
Feature: Checkout Satellite Plan Organic (Legacy) (Upsells)

    Scenario: Customer is presented with the package and term upsell options
        Given a customer visits the organic satellite purchase experience with an upcode for a package and term upsell
        When they go through the organic satellite purchase steps up to the upsell step
        Then they should be presented with the package and term upsell options

    Scenario: Customer is presented with the term upsell option
        Given a customer visits the organic satellite purchase experience with an upcode for a term upsell
        When they go through the organic satellite purchase steps up to the term only upsell step
        Then they should be presented with the term upsell option

    Scenario: Customer can purchase lead offer when presented package and term upsell offers
        Given a customer visits the organic satellite purchase experience with an upcode for a package and term upsell
        When they go through the organic satellite purchase steps without selecting an upsell and complete the transaction
        Then they should land on the confirmation page

    Scenario: Customer can purchase lead offer when presented term upsell offer
        Given a customer visits the organic satellite purchase experience with an upcode for a term upsell
        When they go through the organic satellite purchase steps without selecting a term only upsell and complete the transaction
        Then they should land on the confirmation page

    Scenario: Customer can purchase a package upgrade when presented package and term upsell offers
        Given a customer visits the organic satellite purchase experience with an upcode for a package and term upsell
        When they go through the organic satellite purchase steps and select the package upsell and complete the transaction
        Then they should land on the confirmation page

    Scenario: Customer can purchase a term upgrade when presented package and term upsell offers
        Given a customer visits the organic satellite purchase experience with an upcode for a package and term upsell
        When they go through the organic satellite purchase steps and select the term upsell and complete the transaction
        Then they should land on the confirmation page

    Scenario: Customer can purchase a package and term upgrade when presented package and term upsell offers
        Given a customer visits the organic satellite purchase experience with an upcode for a package and term upsell
        When they go through the organic satellite purchase steps and select the package and term upsell and complete the transaction
        Then they should land on the confirmation page

    Scenario: Customer can purchase a term upgrade when presented a term upsell offer
        Given a customer visits the organic satellite purchase experience with an upcode for a term upsell
        When they go through the organic satellite purchase steps with term upsell only and select the term upsell and complete the transaction
        Then they should land on the confirmation page