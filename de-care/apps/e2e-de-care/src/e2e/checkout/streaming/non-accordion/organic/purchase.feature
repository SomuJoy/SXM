@checkoutDigital
Feature: Checkout Digital Plan Organic Non-Accordion

    Scenario: Customer can purchase offer
        When a customer goes through the organic streaming purchase steps with a valid program code
        Then they should land on the confirmation page
        Then they should be able to register on the confirmation page

    Scenario: Customer can purchase offer via the min variant
        When a customer visits the organic streaming purchase steps min variant URL with query params
        Then they should get redirected to the main organic streaming purchase URL with the same query params

    Scenario: Customer can purchase offer via the min2 variant
        When a customer visits the organic streaming purchase steps min2 variant URL with query params
        Then they should get redirected to the main organic streaming purchase URL with the same query params

    Scenario: Customer can purchase offer via the variant1 variant
        When a customer visits the organic streaming purchase steps variant1 variant URL with query params
        Then they should get redirected to the main organic streaming purchase URL with the same query params

    Scenario: Customer can purchase offer via the variant2 variant
        When a customer visits the organic streaming purchase steps variant2 variant URL with query params
        Then they should get redirected to the main organic streaming purchase URL with the same query params
