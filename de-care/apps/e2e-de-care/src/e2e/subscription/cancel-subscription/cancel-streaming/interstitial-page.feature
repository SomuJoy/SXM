@retain
Feature: Interistitial page

    Scenario: Experience loads the interstitial page before showing the offers
        Given the Target flag interstitial is enabled
        When a customer navigates to the Cancel subscription experience
        Then selects any cancel reason to continue
        Then the experience should load the interstitial page

    Scenario: Experience does not load the interstitial page 
        Given the Target flag interstitial is not enabled
        When a customer navigates to the Cancel subscription experience
        Then selects any cancel reason to continue
        Then the experience should not load the interstitial page
