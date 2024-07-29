@checkoutDigital
Feature: Trial Activation Targeted

    Scenario: Trial Activation Targeted for Used Car Branding Type
        Given A customer with a closed SiriusXM Trial Radio and attempts to activate
        When they hit trial activation targeted url for used car branding type
        Then they should see the one step activation flow