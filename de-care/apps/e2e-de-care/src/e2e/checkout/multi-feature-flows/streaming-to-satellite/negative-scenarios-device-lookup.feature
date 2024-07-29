@checkoutDigital
@checkoutSatellite
Feature: Multi-Feature - Checkout Digital Plan Organic Non-Accordion To Satellite Upsell Negative Scenarios Device Lookup

    Scenario: Customer recieves invalid radio id error using device lookup
        When a customer goes through the organic streaming purchase steps with a valid program code and valid satupcode
        #Then they click on the add car cta and do not have any existing closed devices
        #Then they enter in an invalid radio id and submit
        #Then they should be presented with an invalid radio id error message

    Scenario: Customer recieves invalid vin error using device lookup
        When a customer goes through the organic streaming purchase steps with a valid program code and valid satupcode
        #Then they click on the add car cta and do not have any existing closed devices
        #Then they enter in an invalid vin and submit
        #Then they should be presented with an invalid vin error message

    Scenario: Customer recieves invalid license plate error using device lookup
        When a customer goes through the organic streaming purchase steps with a valid program code and valid satupcode
        #Then they click on the add car cta and do not have any existing closed devices
        #Then they enter in an invalid license plate and submit
        #Then they should be presented with an invalid license plate error message
