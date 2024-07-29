@checkoutSatellite
Feature: Checkout Satellite Plan Organic Accordion Upgrade VIP due to quote failure
    Scenario: Customer can not upgrade to a VIP offer without selecting a second plan due to quote failure
        When a customer visits the upgrade vip organic page with a valid program code
        Then they lookup an account that does not have an active VIP subscription
        Then they choose to add a second radio later
        Then they are not able complete the payment due to quote failure
        Then they should be taken back to payment page

