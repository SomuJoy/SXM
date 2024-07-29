@checkoutDigital
@analytics
Feature: Checkout Digital Plan Organic Non-Accordion (legacy) (Analytics Smoke Test)

    Scenario: Legacy digital data object exists on Window object
      When a customer visits the experience
      Then the Window object should have a property named digitalData set to an object
