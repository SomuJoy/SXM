Feature: Analytics for errors - business logic

    Scenario: No radio id found
        Given A customer submits the radio id or vin form with no match data
        Then the EDDL should contain a business error entry for no radio match found

    Scenario: Invalid VIN found
        Given A customer submits the radio id or vin form with an invalid VIN
        Then the EDDL should contain a business error entry for invalid VIN found