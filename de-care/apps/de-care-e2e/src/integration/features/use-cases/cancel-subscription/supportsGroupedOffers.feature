Feature: Cancel Subscription Request

    Scenario: Grouped offers presentment

        Given A customer qualifies for a grouped offer
        When they they navigate to the cancel online URL
        And they get to the change plan step
        Then they should see a single card for a grouped offer
        And the offer options should be presented within that single card

    Scenario: Grouped offers change plan transaction

        Given A customer qualifies for a grouped offer and wants to change subscription
        When they they navigate to the cancel online URL
        And they choose to change to one of the grouped offer options
        Then they should be able to complete the transaction
