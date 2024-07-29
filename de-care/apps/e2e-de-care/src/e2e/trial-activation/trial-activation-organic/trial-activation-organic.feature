@checkoutDigital
Feature: Trial Activation Organic

    Scenario: Trial Activation Organic for Used Car Branding Type
        Given A customer with a closed SiriusXM Trial Radio and attempts to activate
        When they hit trial activation targeted url with prospect token and program code
        Then they should see the activation flow