@checkoutDigital
@checkoutSatellite
Feature: Multi-Feature - Checkout Digital Plan Organic Non-Accordion To Satellite Upsell

    Scenario: Customer can purchase a digital plan then upsell to a satellite plan using device lookup
        When a customer goes through the organic streaming purchase steps with a valid program code and valid satupcode
        #Then they click on the add car cta and do not have any existing closed devices
        #Then they should be able to lookup a device by radio id
        #Then they should be able to complete the transaction using card on file

    Scenario: Customer can purchase a digital plan then upsell to a satellite plan using existing devices
        When a customer goes through the organic streaming purchase steps with a valid program code and valid satupcode
        #Then they click on the add car cta and existing closed devices are found
        #Then they should be able to use an existing device
        #Then they should be able to complete the transaction using card on file

    Scenario: Customer with no vehicleInfo can purchase a digital plan then upsell to a satellite plan using existing devices
        When a customer goes through the organic streaming purchase steps with a valid program code and valid satupcode
        #Then they click on the add car cta and existing closed devices with no vehicleInfo are found

    Scenario: Customer with nickname can purchase a digital plan then upsell to a satellite plan using existing devices
        When a customer goes through the organic streaming purchase steps with a valid program code and valid satupcode
        #Then they click on the add car cta and existing closed devices with nickname are found  

    Scenario: Customer with existing device can purchase a digital plan then upsell to a satellite plan using device lookup
        When a customer goes through the organic streaming purchase steps with a valid program code and valid satupcode
        #Then they click on the add car cta and existing closed devices are found
        #Then they choose to look up a device that is not listed
