Feature: Offer Details For Choice Offer Are Correct
    Scenario: Customer is purchasing choice offer using RTC flow should see correct offer details ( Targeted or Direct mail - proactive flow)
        Given Customer has a choice offer in organic and they are eligible for choice
        When they select choice from the plan grid
        Then they see the correct offer details
        And they identify and are presented the plan grid
        Then they see the correct offer details
        And they continue to checkout
        Then they see the correct offer details