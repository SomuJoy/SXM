@checkoutSatellite
Feature: Checkout Satellite Plan Targeted Non-Accordion (Negative Scenarios)

    Scenario: Customer is redirected to legacy targeted checkout experience when url contains an upcode
        When a customer visits the targeted satellite purchase experience with an upcode in the url
        Then they should be redirected to the legacy targeted checkout experience

    Scenario: Customer is redirected to legacy targeted checkout experience when url contains an promocode
        When a customer visits the targeted satellite purchase experience with an promocode in the url
        Then they should be redirected to the legacy targeted checkout experience

    Scenario: Customer is redirected to organic checkout experience when account not found
        When a customer without an account visits the targeted satellite purchase experience
        Then they should be redirected to the organic checkout experience

    Scenario: Customer is redirected to the generic satellite error page when using an invalid radio id
        When a customer without an invalid radio id visits the targeted satellite purchase experience
        Then they should be redirected to the generic satellite error page

    Scenario: Customer is redirected to the global error page when a system error occurs
        When a customer visits the targeted satellite purchase experience and the env info service returns a 500
        Then they should be redirected to the general error page
