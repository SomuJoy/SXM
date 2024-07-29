@checkoutDigital
Feature: Checkout Digital Plan Targeted Non-Accordion (Multi Radio Discount - MRD)

    Scenario: Customer can purchase a multi radio discount offer
        When a customer visits the targeted streaming purchase experience and is qualified for a multi radio discount
        Then they go through all the purchase steps for the targeted experience
    #     Then they should land on the targeted confirmation page

    # Scenario: Customer is presented multi radio discount offer text copy
    #     When a customer visits the targeted streaming purchase experience and is qualified for a multi radio discount
    #     Then they should be presented with an option to select a plan
    #     Then when they go through the purchase steps to the review step
    #     Then they should be presented with messaging about multi radio discount
        
