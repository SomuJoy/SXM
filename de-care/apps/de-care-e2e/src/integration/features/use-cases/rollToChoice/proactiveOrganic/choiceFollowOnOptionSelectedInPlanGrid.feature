Feature: Choice Follow On Option Selected In Plan Grid

    Scenario: A Customer has selected Choice as a follow on option from the grid. ( Targeted or Direct mail - proactive flow)
        Given Customer is on the comparison RTC grid which has Choice, select and AA as follow on options.
        When they select Choice from the grid and continue
        Then they should be presented with Choose your genre selection form step where they can select the genre for choice.