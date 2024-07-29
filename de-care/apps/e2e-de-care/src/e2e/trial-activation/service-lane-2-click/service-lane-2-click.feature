@checkoutDigital
Feature: Service Lane 2 Click

    Scenario: Service lane 2 click new vehicle
        Given A customer with a closed SiriusXM Trial Radio and attempts to activate
        When they hit the service lane 2 click url for new vehicle
        Then they should see the confirmation page

    Scenario: Service lane 2 click used vehicle
        Given A customer with a closed SiriusXM Trial Radio and attempts to activate
        When they hit the service lane 2 click url for used vehicle
        Then they should see the confirmation page