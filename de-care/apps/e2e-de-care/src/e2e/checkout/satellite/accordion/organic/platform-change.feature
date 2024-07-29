@checkoutSatellite
Feature: Checkout Satellite Plan Organic (Legacy) (Change Platform)

    Scenario: Customer is presented with the change platform notice when identifying with a radio id
        Given a customer visits the organic satellite purchase experience with an program code for a SiriusXM platform offer
        When they identify using a radio id for a device that is not on the SiriusXM platform
        Then they should be presented with the change platform notice
#
    Scenario: Customer is presented with the change platform notice when identifying with a VIN
        Given a customer visits the organic satellite purchase experience with an program code for a SiriusXM platform offer
        When they identify using a VIN for a device that is not on the SiriusXM platform
        Then they should be presented with the change platform notice

    Scenario: Customer is presented with the change platform notice when identifying with a license plate
        Given a customer visits the organic satellite purchase experience with an program code for a SiriusXM platform offer
        When they identify using a license plate for a device that is not on the SiriusXM platform
        Then they should be presented with the change platform notice

    Scenario: Customer is presented with the change platform notice when identifying with FLEPZ
        Given a customer visits the organic satellite purchase experience with an program code for a SiriusXM platform offer
        When they identify using FLEPZ for a device that is not on the SiriusXM platform
        Then they should be presented with the change platform notice

    Scenario: Customer is presented with a new lead offer based on platform change
        Given a customer visits the organic satellite purchase experience with an program code for a SiriusXM platform offer
        When they identify using a radio id for a device that is not on the SiriusXM platform and confirm the change platform notice
        Then they should be presented with a new lead offer for the platform

    Scenario: Customer can purchase an offer based on platform change
        Given a customer visits the organic satellite purchase experience with an program code for a SiriusXM platform offer
        When they identify using a radio id for a device that is not on the SiriusXM platform and complete the transaction
        Then they should land on the confirmation page