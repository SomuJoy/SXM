@retain
Feature: Response for request Cancel contains special offer for Platinum Streaming

    Scenario: Experience should load the special preselected offer page instead of the grid
        Given the Platinum Streaming plan is returend by PEGA
        When a customer navigates to the Cancel subscription experience
        Then selects any cancel reason to continue
        Then the experience should load the special preselected offer page
