Feature: RFLZ Widget - Adobe Launch

    Scenario: Component is rendered
        Given a user is on a page with the RFLZ widget
        Then the data layer should have an authentication page record for the RFLZ component
        And a track event that RFLZ was loaded

    Scenario: Client side validation
        Given a user is on a page with the RFLZ widget
        When they submit the form without filling out any fields
        Then the data layer should have error records for all invalid fields

    Scenario: Submission failure (general)
        Given a user is on a page with the RFLZ widget
        When they submit the form and lookup failed
        Then there should be a track event that RFLZ failed

    Scenario: Submission failure (promo code)
        Given a user is on a page with the RFLZ widget
        When they submit the form and lookup failed due to invalid promo code
        Then there should be a track event that RFLZ failed
        And the data layer should have a record for the promo code

    Scenario: Submission success
        Given a user is on a page with the RFLZ widget and ready with valid data for a successful lookup
        When they submit the form with valid data for a successful lookup
        Then the data layer should have a record for the radio id
        And the data layer should have a record for the authentication type
        And a track event that RFLZ was successful
