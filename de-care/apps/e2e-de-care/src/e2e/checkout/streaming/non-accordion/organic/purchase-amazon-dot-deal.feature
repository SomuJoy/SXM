@checkoutDigital
Feature: Checkout Digital Plan Organic Non-Accordion Amazon dot deal
    Scenario: Customer is purchasing an offer with Amazon dot deal
        When a customer goes through the organic streaming purchase steps with an offer with Amazon dot deal
        Then they should land in the offer page and see the expected lead offer
        Then they should be presented with the deal offer
        Then they should see the expected features list
