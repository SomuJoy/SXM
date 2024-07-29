Feature: Customer offered RTC not eligible for choice

    Feature Description
    Scenario: A customer is offered RTC offer with choice plan but they are NOT eligible for choice ( Targeted or Direct mail - proactive flow)

        Given Customer has a choice offer in Direct mail or targeted link but they are NOT eligible for choice package.
        When they click on the link to purchase the offer or identifies themselves using account info in DM flow
        Then they should be presented with an error message on the grid with MM select AA follow options in the grid.