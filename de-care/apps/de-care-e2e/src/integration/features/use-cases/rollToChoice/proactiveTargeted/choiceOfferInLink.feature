    Scenario: A Customer with choice offer in the link ( Targeted or Direct mail - proactive flow)

        Given A customer has an offer for Roll to choice with choice plan.
        When they click on the URL to purchase the offer
        Then they should see the comparison grid/ plan grid with a choice plan as a one of the follow on options.