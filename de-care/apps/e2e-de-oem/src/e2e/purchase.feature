Feature: Purchase a full pay subscription

    Scenario: Customer is presented a self pay promo offer
        Given a customer visits the purchase flow with valid device information
        Then they should be presented a self pay promo offer
