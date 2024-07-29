@retain
Feature: Request cancel satellite subscription

  Scenario: Experience loads cancel reasons page for logged in customer
    When a logged in customer navigates to the cancel option
    Then they should see a page with the satellite cancel reasons

  Scenario: Experience loads options for the customer to choose a new Plan from a grid
    When a logged in customer navigates to the cancel option
    When a customer selects any reason
    Then clicks on the Cancel Reasons Continue button
    Then the experience should load the plans grid for the customer

  Scenario: Customer can select a new plan
    When a logged in customer navigates to the cancel option
    When a customer selects any reason
    Then clicks on the Cancel Reasons Continue button
    When a customer selects a new plan in the grid
    Then clicks on the Switch Subscription button
    Then navigates to Pick your billing plan step

  Scenario: Customer can select a billing plan
    When a logged in customer navigates to the cancel option
    When a customer selects any reason
    Then clicks on the Cancel Reasons Continue button
    When a customer selects a new plan in the grid
    Then clicks on the Switch Subscription button
    Then navigates to Pick your billing plan step
    When a customer selects a billing plan
    Then clicks on the Continue button
    Then navigates to the payment information step

  Scenario: Customer can select a payment method
    When a logged in customer navigates to the cancel option
    When a customer selects any reason
    Then clicks on the Cancel Reasons Continue button
    When a customer selects a new plan in the grid
    Then clicks on the Switch Subscription button
    Then navigates to Pick your billing plan step
    When a customer selects a billing plan
    Then clicks on the Continue button
    When a customer selects the existing credit card option
    Then clicks on the Continue button in the payment information step
    Then navigates to the quote

  Scenario: Customer can purchase the new plan selected
    When a logged in customer navigates to the cancel option
    When a customer selects any reason
    Then clicks on the Cancel Reasons Continue button
    When a customer selects a new plan in the grid
    Then clicks on the Switch Subscription button
    Then navigates to Pick your billing plan step
    When a customer selects a billing plan
    Then clicks on the Continue button
    When a customer selects the existing credit card option
    Then clicks on the Continue button in the payment information step
    When a customer accepts the Credit Card Agreement
    Then clicks on the Complete my order button
    Then the customer is redirected to the confirmation page
