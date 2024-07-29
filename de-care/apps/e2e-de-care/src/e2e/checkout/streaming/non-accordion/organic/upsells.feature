@checkoutDigital
Feature: Checkout Digital Plan Organic Non-Accordion (Upsells)

    Scenario: Customer is presented with the term upsell offer
        When a customer goes through the organic streaming purchase steps when qualifying for a term upsell
        Then they should be presented with the term upsell option

    Scenario: Customer can purchase term upsell offer
        When a customer goes through the organic streaming purchase steps when qualifying for a term upsell
        Then they should be able to complete the transaction for the term upsell offer
        Then they should land on the confirmation page
        Then the deal redemption instructions should be presented

    Scenario: Customer can purchase lead offer when presented term upsell offer
        When a customer goes through the organic streaming purchase steps when qualifying for a term upsell
        Then they should be able to complete the transaction for the lead offer
        Then they should land on the confirmation page
        Then the deal redemption instructions should not be presented

    Scenario: Upsell options go away when customer is not allowed offer based on consumption logic
        When a customer goes through the organic streaming purchase steps when qualifying for a term upsell
        Then they enter non-qualifying data for the payment step and try and complete the transaction
        Then they should be presented with a fallback offer
        Then when they go back to the payment step they should not be presented with the term upsell option
        Then they should be able to complete the transaction for the fallback offer
        Then they should land on the confirmation page
        Then the deal redemption instructions should not be presented

    Scenario: Selected plan reverts to lead offer when customer goes back before the payment step
        When a customer goes through the organic streaming purchase steps when qualifying for a term upsell
        Then they select the term upsell offer and submit the payment form
        Then they should land on the review step
        Then when they navigate back to the payment step
        Then the term upsell offer should be selected
        Then when they go back to the previous step and then proceed forward
        Then the lead offer should be selected in the upsell form

    Scenario: Consumption logic works when selected offer is the upsell offer
        When a customer goes through the organic streaming purchase steps when qualifying for a term upsell
        Then they select the upsell offer
        Then they enter non-qualifying data for the payment step and try and complete the transaction
        Then they should be presented with a fallback offer
