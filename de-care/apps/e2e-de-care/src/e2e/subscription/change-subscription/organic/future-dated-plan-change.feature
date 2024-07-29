@retain
Feature: Futue Dated Plan Change

Scenario: Experience opens modal if account has Self pay and promo follow-on
    Given a customer has a self pay account with a promo follow on plan
    When the customer selects a new plan and continue
    Then a warning modal window should display

Scenario: Experience opens modal if account has Self pay and promo follow-on - downgrade
    Given a customer has a self pay account with a promo follow on plan
    When the customer selects a downgrade plan and continue
    Then a warning modal window should display
    Then should contain a list of excluded channels
