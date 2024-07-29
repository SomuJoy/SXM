Feature: Analytics for errors - client side validation

    Scenario: Find account
        Given A customer submits the FLEPZ form with no fields filled out
        Then the EDDL should contain a front end error entry for FLEPZ form fields

    Scenario: Find radio
        Given A customer submits the radio id or vin form with an empty value
        Then the EDDL should contain a front end error entry for Auth - Missing or invalid radio ID/VIN

    Scenario: Create credentials
        Given A customer submits the create credentials form with no fields filled out
        Then the EDDL should contain a front end error entry for create credentials form fields

    Scenario: Registration wizard address and phone
        Given A customer submits the registration address form with no fields filled out
        Then the EDDL should contain a front end error entries for address and phone number form fields

    Scenario: Registration wizard credentials
        Given A customer submits the registration credentials form with no fields filled out
        Then the EDDL should contain a front end error entries for credentials form fields

    Scenario: Registration wizard security questions
        Given A customer submits the registration security questions form with no fields filled out
        Then the EDDL should contain a front end error entries for security questions form fields