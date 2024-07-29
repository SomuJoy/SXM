@checkoutDigital
Feature: Checkout Digital Plan Targeted Non-Accordion (Roll To Drop - RTD)

    Scenario: Trial RTD user could add a follow on
        When a trial RTD customer visits the targeted streaming purchase experience, could see the offer page
        Then user should see setup your payment step after clicks on continue
        Then user should see expected review page step after payment information is sent
        Then the user should be able to accept and submit the review
        Then they should land on the targeted confirmation page
