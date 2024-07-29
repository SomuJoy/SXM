@checkoutDigital
@checkoutSatellite
Feature: Multi-Feature - Checkout Digital Plan Organic Non-Accordion To Satellite Upsell Negative Scenarios Device Lookup

    Scenario: Customer enters a valid radio id using device lookup
        When a customer goes through the organic streaming purchase steps with a valid program code and valid satupcode
        #Then they click on the add car cta and do not have any existing closed devices
        #Then they enter in a valid radio id and submit
        #Then they should be presented with the payment page

    Scenario: Customer enters a valid vin using device lookup
        When a customer goes through the organic streaming purchase steps with a valid program code and valid satupcode
        #Then they click on the add car cta and do not have any existing closed devices
        #Then they enter in a valid vin and submit
        #Then they should be presented with the payment page

    Scenario: Customer enters a valid license plate using device lookup
        When a customer goes through the organic streaming purchase steps with a valid program code and valid satupcode
        #Then they click on the add car cta and do not have any existing closed devices
        #Then they enter in a valid license plate and submit
        #Then they confirm their vin
        #Then they should be presented with the payment page
