@retain
Feature: Transfer service continuity

  Scenario: Customer can add radio to their account
    When a customer navigates to the transfer radio login page and enters in valid info for an account with a trial and follow on
    Then they should be able to complete the service continuity flow
    Then they should land on the thanks page
