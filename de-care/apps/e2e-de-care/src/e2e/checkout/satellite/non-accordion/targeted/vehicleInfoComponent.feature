@checkoutSatellite
Feature: Checkout Satellite Plan Targeted Non-Accordion Vehichle Info Component
    Scenario: Vehicle Info Component loads correctly for targeted customer who has a nickname on their subscription
        When a customer with a nickname on their subscription visits the satellite non-accordion targeted flow
        Then they should see the Vehicle Info Component
        Then only their nickname should be displayed
    
    Scenario: Vehicle Info Component loads correctly for targeted customer who has YMM Info on their vehicle
        When a customer with YMM and no nickname visits the satellite non-accordion targeted flow
        Then they should see the Vehicle Info Component
        Then only their YMM should be displayed

    Scenario: Vehicle Info Component loads correctly for targeted customer who has two vehicles with the same YMM Info
        When a customer with duplicate YMM's and no nickname visits the satellite non-accordion targeted flow
        Then they should see the Vehicle Info Component
        Then both their YMM and radioId should displayed

    Scenario: Vehicle Info Component loads correctly for targeted customer who has no nickname or YMM Info
        When a customer with no nickname or ymm info visits the satellite non-accordion targeted flow
        Then they should see the Vehicle Info Component
        Then only their masked radioId should be displayed
