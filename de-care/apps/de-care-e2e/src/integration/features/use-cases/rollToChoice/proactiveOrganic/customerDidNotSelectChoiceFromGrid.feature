Feature: Customer did not select Choice from Grid

    Scenario: A Customer has selected any other follow on option except "Choice" from the grid. ( Targeted or Direct mail - proactive flow)

        Given Customer is on the comparison RTC grid which has Choice, select and AA as follow on options.
        When they select any other follow on option except "Choice" from the grid and continue
        Then they should be presented with payment step.