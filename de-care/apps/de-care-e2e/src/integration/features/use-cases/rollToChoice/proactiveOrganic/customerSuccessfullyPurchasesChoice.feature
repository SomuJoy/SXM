Feature: Customer can purchase Choice Successfully
    Scenario: Customer is successfully able to purchase the choice package in RTC ( Targeted or Direct mail - proactive flow)
        Given Customer has a choice offer in Direct mail or targeted link and they are eligible for choice
        When they try to purchase the offer by completing each and every necessary step
        Then they should be able to purchase the offer or complete the transaction.