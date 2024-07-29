@checkoutDigital
Feature: Checkout Digital Plan Targeted Non-Accordion (Negative Scenarios Roll To Drop - RTD)

    Scenario: Experience handles not eligible for RTD
        When a self paid customer that is not eligible visits the targeted streaming purchase experience
        Then they should be presented with the "you already have a subscription error page"
