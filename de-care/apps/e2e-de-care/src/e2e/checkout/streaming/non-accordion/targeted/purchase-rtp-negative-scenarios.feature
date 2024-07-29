@checkoutDigital
Feature: Checkout Digital Plan Targeted Non-Accordion (Negative Scenarios Roll To Pay - RTP)

    Scenario: Experience handles not eligible for RTP conversion
        When a trial RTP customer that is not eligible visits the targeted streaming purchase experience
        Then they should be presented with the generic error page
