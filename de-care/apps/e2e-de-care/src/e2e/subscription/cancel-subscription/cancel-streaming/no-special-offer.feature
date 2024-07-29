@retain
Feature: Response for request Cancel does not contain a special offer

    Scenario: Experience should load the the plans grid
        Given that no special offer plans are returend by PEGA
        When a customer navigates to the Cancel subscription experience
        Then selects any cancel reason to continue
        Then the experience should load the plans grid
