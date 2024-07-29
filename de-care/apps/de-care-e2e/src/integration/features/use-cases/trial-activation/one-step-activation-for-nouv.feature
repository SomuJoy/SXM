Feature: NOUV

  Scenario: One step NOUV (PHX - no vehicle)
    Given the customer has no vehicle info but valid radioId in token
    When they visit the PHX landing page
    Then they should see the default eligibility message

  Scenario: One step NOUV (PHX - valid vehicle)
    Given the customer has valid vehicle info and valid radioId in token
    When they visit the PHX landing page
    Then they should see their vehicle info in the eligibility message

  Scenario: One step NOUV Submission (PHX)
    Given the customer has valid vehicle info and valid radioId in token
    When they visit the PHX landing page
    And they fill out the form correctly
    Then they should see the confirmation page
