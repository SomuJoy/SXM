Feature: Registration

  Scenario: Multiple accounts
    Given the customer is trying to register with multiple accounts
    When they visit the registration page
    And they see the header and main copy
    And they fill out the flepz form
    Then they should see a listing of all accounts

  Scenario: Single account
    Given the customer is trying to register with single account
    When they visit the registration page
    And they fill out the flepz form
    Then they should see only one account

  Scenario: No account
    Given the customer is trying to register with no account
    When they visit the registration page
    And they fill out the flepz form
    Then they should see an alternative authentication page

  Scenario: Multiple account verify links (all options)
    Given the customer is trying to register with multiple accounts
    And they visit the registration page
    And they fill out the flepz form
    When they click verify on an account with all options
    Then they should see a modal with all options showing

  Scenario: Multiple account verify links (no radioId)
    Given the customer is trying to register with multiple accounts
    And they visit the registration page
    And they fill out the flepz form
    When they click verify on an account with no radioId
    Then they should see a modal with phone and account number, but no radioId

  Scenario: Single account no phone number
    Given the customer is trying to register with a single account with radioId but no phone number
    And they visit the registration page
    And they fill out the flepz form
    When they click the verify button
    Then they should see a modal with radioId and account number, but no phone number

  Scenario: Verify account number
    Given the customer is trying to register with a single account with radioId
    And they visit the registration page
    And they fill out the flepz form
    When they click the verify button
    And they choose account number in the modal
    And they enter a valid account number
    Then they should be taken to the complete-registration page

  Scenario: Phone 2FA
    Given the customer is trying to register with a single account by phone
    And they visit the registration page
    And they fill out the flepz form
    When they click the verify button
    And they choose phone number in the modal
    And they enter a valid phone number
    And they accept the terms
    And they enter a valid security code
    Then they should be taken to the complete-registration page
