@onboarding
Feature: Sonos Onboarding Valid Activation Code
    
     Scenario: Customer should get to sign in page when activation code is Valid
        When a user visits the activation code url 
        Then they should land on the sign in page
        Then when they update the sign in form 
        Then they should land on the confirmation page
