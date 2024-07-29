@checkoutDigital
Feature: Checkout Digital Plan Targeted Non-Accordion add Streaming

    Scenario: Customer which applies to MRD tries to add streaming
        When customer which applies to MRD enters into add streaming flow
        Then goes through all the expexted steps for add streaming targeted experience
        Then user could purchase and add a streaming subscription to the account
