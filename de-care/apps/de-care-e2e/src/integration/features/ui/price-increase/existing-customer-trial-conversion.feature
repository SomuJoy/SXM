Feature: price increase messaging

    Scenario: existing customer trial conversion

        Given satellite existing customer is on a trial
        When doing a trial conversion
        Then customer must see a price increase message