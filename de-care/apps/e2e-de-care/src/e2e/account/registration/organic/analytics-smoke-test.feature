@onboarding
@analytics
Feature: Account Registration Organic (Analytics Smoke Test)

    Scenario: Legacy digital data object exists on Window object
      When a customer visits the experience
      Then the Window object should have a property named digitalData set to an object
