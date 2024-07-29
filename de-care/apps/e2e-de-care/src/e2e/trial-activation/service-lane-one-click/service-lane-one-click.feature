@checkoutSatellite
Feature: Service Lane One Click

    Scenario: Service lane one click trial activation
        Given A customer with trial attempts to activate that trial
        When they navigate to the service lane one click url
        Then they should see the confirmation page
