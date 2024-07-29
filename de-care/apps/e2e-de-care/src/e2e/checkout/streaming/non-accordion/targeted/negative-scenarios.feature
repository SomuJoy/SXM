@checkoutDigital
Feature: Checkout Digital Plan Targeted Non-Accordion (Negative Scenarios)

    Scenario: Customer is redirected to organic checkout experience when not registered
        When a customer without an active subscription and account is not registered visits the targeted streaming purchase experience
        Then they should be redirected to the organic checkout experience
