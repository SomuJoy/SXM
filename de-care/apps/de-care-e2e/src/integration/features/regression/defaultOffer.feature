Feature: Default offer

  Scenario: Invalid program code
    Given a satellite customer
    When the customer navigates into PHX with an invalid program code
    Then they should see the alert pill for invalid code
    And they should not see the old experience
    When they identify with a valid radioId
    Then they should see the new targetted offer

  Scenario: Expired program code
    Given a satellite customer
    When the customer navigates into PHX with an expired program code
    Then they should see the alert pill for expired code
    And they should not see the old experience
    When they identify with a valid radioId
    Then they should see the new targetted offer

  Scenario: (control) Valid program code
    Given a satellite customer
    When the customer navigates into PHX with a valid program code
    Then they should see the old experience
