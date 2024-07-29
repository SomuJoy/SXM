@retain
Feature: Request cancel infotainment subscription
    Scenario: Customer goes through the cancelation process and views summary
        When a customer goes through cancellation process
        Then navigates to the Cancel summary step

