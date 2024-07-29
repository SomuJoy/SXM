@retain
Feature: Response for request Cancel returning empty offers array

    Scenario: Experience should load the no-offers page
        Given that offers response contains an empty offers array
        When a customer navigates to the Cancel subscription experience
        Then selects any cancel reason to continue
        Then the experience should load the no-offers page
