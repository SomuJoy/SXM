Feature: Change Subscription Request

    Scenario: Customer with existing infotainment subscription

        Given a customer has an existing subscription with infotainment
        When they navigate to the change subscription URL
        Then they should see info about their existing infotainment plan

    Scenario: Package options include ones with infotainment

        Given a customer qualifies for offers with infotainment
        When they navigate to the change subscription URL
        Then they should see a step for choosing an infotainment package
        And the infotainment step should present optional choices for the infotainment packages

    Scenario: Infotainment offers include one with bundle

        Given a customer qualifies for offers with infotainment bundle
        When they navigate to the change subscription URL
        Then they should see an optional choice for an infotainment package bundle
        And they select an individual infotainment package
        And then they select a bundle infotainment package
        Then the individual infotainment package should be deselected
        And they select all individual infotainment packages
        Then the bundle infotainment package should be selected instead of the individual packages

    Scenario: Customer chooses to not take an infotainment package

        Given a customer qualifying for offers with infotainment does not want to take one
        When they navigate to the change subscription URL
        And they click continue on the infotainment package step without selecting a package
        Then they should not see any infotainment package in the inactive step
        And the order summary should not contain a line item for the infotainment package
        And they should be able to complete the change subscription transaction

    Scenario: Customer chooses to take an infotainment package

        Given a customer qualifies for offers with infotainment
        When they navigate to the change subscription URL
        And they select an infotainment package and click continue
        Then they should see the infotainment package they selected in the inactive step
        And they should be able to edit the infotainment step and change their selected infotainment package
        And the order summary should contain a line item for the infotainment package
        And they should be able to complete the change subscription transaction
