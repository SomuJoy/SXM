@retain
Feature: Change subscription

  Scenario: Experience loads correct change plan offer for targeted with token
    When a customer navigages with a valid token and is eligible for the upgrade
    Then they should see a step for choosing a package with the first one being preselected
