Feature: Cancel Subscription Request

    Scenario: Successfully change plan

        Given a customer is willing to accept a save offer
        When they navigate to the cancel online URL
        And they choose to take a change offer
        Then they should be navigated to the confirmation page
