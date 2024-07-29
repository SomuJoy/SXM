@checkoutDigital
Feature: Checkout Digital Plan Organic Non-Accordion Satellite upsell

    Scenario: Customer can see satellite upsell
        When a customer goes through the organic streaming purchase steps with a valid program code and valid satupcode
        Then they should land on the confirmation page
        #Then they should be able to see the satellite upsell ui
