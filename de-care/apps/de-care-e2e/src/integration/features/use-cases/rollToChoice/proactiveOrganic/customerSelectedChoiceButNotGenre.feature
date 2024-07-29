Feature: Customer selected choice but not genre

    Scenario: A Customer has selected Choice as a follow on option from the grid and continues without selecting genre. ( Targeted or Direct mail - proactive flow)

        Given Customer has selected Choice from the grid and they are on Choose your genre step
        When they click continue on choose your genre without selecting any option
        Then they should be presented with an error message Pick a genre below. under  Choose your genre step.