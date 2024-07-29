@checkoutSatellite
Feature: Checkout Satellite Plan Organic Accordion Upgrade VIP
    Scenario: Experience loads VIP offer
        When a customer visits the upgrade vip organic page with a valid program code
        Then they should be presented with the VIP offer
    
    Scenario: Customer can upgrade to a VIP offer without selecting a second plan
        When a customer visits the upgrade vip organic page with a valid program code
        Then they lookup an account that does not have an active VIP subscription
        Then they choose to add a second radio later
        Then they complete the payment and review steps
        Then they should land on the confirmation page
