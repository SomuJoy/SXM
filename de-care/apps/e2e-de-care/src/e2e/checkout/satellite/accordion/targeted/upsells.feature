@checkoutSatellite
Feature: Checkout Satellite Plan Targeted (Legacy) (Upsells)

    Scenario: Customer is presented with the package and term upsell options
        Given a customer visits the targeted satellite purchase experience with an upcode for a package and term upsell
        When they go through the targeted satellite purchase steps up to the upsell step
        Then they should be presented with the package and term upsell options

    Scenario: Customer is presented with the term upsell option only
        Given a customer visits the targeted satellite purchase experience with an upcode for a term upsell only
        When they go through the targeted satellite purchase steps up to the upsell step for upsell only
        Then they should be presented with the term upsell option only

    Scenario: Customer can purchase lead offer when presented package and term upsell offers
        Given a customer visits the targeted satellite purchase experience with an upcode for a package and term upsell
        When they go through the targeted satellite purchase steps without selecting an upsell and complete the transaction
        Then they should land on the confirmation page

    Scenario: Customer can purchase lead offer when presented term upsell offer only
        Given a customer visits the targeted satellite purchase experience with an upcode for a term upsell only
        When they go through the targeted satellite purchase steps without selecting a term only upsell and complete the transaction
        Then they should land on the confirmation page

    Scenario: Customer can purchase a package upgrade when presented package and term upsell offers
        Given a customer visits the targeted satellite purchase experience with an upcode for a package and term upsell
        When they go through the targeted satellite purchase steps and select the package upsell and complete the transaction
        Then they should land on the confirmation page

    Scenario: Customer can purchase a term upgrade when presented package and term upsell offers
        Given a customer visits the targeted satellite purchase experience with an upcode for a package and term upsell
        When they go through the targeted satellite purchase steps and select the term upsell and complete the transaction
        Then they should land on the confirmation page

    Scenario: Customer can purchase a package and term upgrade when presented package and term upsell offers
        Given a customer visits the targeted satellite purchase experience with an upcode for a package and term upsell
        When they go through the targeted satellite purchase steps and select the package and term upsell and complete the transaction
        Then they should land on the confirmation page

    Scenario: Customer can purchase a term upgrade when presented a term upsell offer
        Given a customer visits the targeted satellite purchase experience with an upcode for a term upsell only
        When they go through the targeted satellite purchase steps and select the term only upsell and complete the transaction
        Then they should land on the confirmation page
