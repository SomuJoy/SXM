Feature: price increase messaging

    Scenario: existing customer trial conversion

        Given a potential customer
        When purchasing a new subscription
        Then customer must see a price increase message