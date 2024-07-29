@retain
Feature: Request cancel streaming subscription

    Scenario: Experience loads cancel reasons page for logged in customer with streaming subscription
        When a logged in customer navigates to the cancel option
        Then they should see a page with the streaming cancel reasons

    Scenario: Experience loads the interstitial page before showing the offers
        Given the Target flag interstitial is enabled
        When a customer navigates to the Cancel subscription experience
        Then selects any cancel reason to continue
        Then the experience should load the interstitial page
        Then if the customer clicks on the Continue button
        Then the experience should load the offer page

    Scenario: Customer completes the cancellation preprocess
        When a customer navigates to the Cancel subscription experience
        Then selects any cancel reason to continue
        Then if the customer clicks on the Continue button
        When a customer clicks on Continue to cancel
        Then navigates to the Cancel summary step
        Then clicks on the Cancel Subscription button
        Then navigates to the Cancel Confirmation Step

