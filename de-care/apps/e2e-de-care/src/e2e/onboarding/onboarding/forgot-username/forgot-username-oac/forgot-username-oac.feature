
@onboarding
Feature: forgot username for oac

  Scenario: customer can reset the username from oac
    When they update the reset username form
    Then they should land on the multiple username landing page
  
   Scenario: Customer should be able to get the username confirmation screen 
    When they update the reset username form
    Then they should land on the multiple username landing page
    Then when they click on get username cta
    Then they should land on the confirmation page
