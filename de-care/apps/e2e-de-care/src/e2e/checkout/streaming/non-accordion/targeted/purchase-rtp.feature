@checkoutDigital
Feature: Checkout Digital Plan Targeted Non-Accordion (Roll To Pay - RTP)

    Scenario: Existing customer with trial RTP is presented offer and amazon dot deal
        When a trial RTP customer visits the targeted streaming purchase experience for an offer with amazon dot deal
        Then they should be presented with the lead offer
        Then they should be presented with the deal offer
        Then they should see the expected features list

