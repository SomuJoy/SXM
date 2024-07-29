Feature: price increase messaging

    Scenario: customer tries to activate new streaming subscription

        Given a potential streaming customer
        When activates a new subscription
        Then do not show the message