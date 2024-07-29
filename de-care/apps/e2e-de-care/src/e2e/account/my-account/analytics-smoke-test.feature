@myAccount
@analytics
Feature: My Account (Analytics Smoke Test)

    Scenario: Legacy digital data object exists on Window object for login page
      When a customer visits the login page
      Then the Window object should have a property named digitalData set to an object

    Scenario: Legacy digital data object exists on Window object for logged in experience
      Given a customer visits the my account experience while logged in
      Then the Window object should have a property named digitalData set to an object
