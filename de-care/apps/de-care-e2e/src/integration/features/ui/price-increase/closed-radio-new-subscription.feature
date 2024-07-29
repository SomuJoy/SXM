Feature: price increase messaging

    Scenario: closed radio new subscription

        Given a potential customer
        When purchasing a new subscription with Follow on
        Then customer must see a price increase message