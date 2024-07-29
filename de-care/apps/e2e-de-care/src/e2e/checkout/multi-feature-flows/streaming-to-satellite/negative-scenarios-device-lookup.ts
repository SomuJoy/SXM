import { Before, Then } from '@badeball/cypress-cucumber-preprocessor';
import { deviceLookupEnterRadioIdAndSubmit } from './common-utils/ui';
import { stubIdentityDeviceLicensePlateNotFound } from '../../../../support/stubs/de-microservices/identity';
import { stubDeviceValidateInvalidVin, stubDeviceValidateRadioIdNotFound } from '../../../../support/stubs/de-microservices/device';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Customer recieves invalid radio id error using device lookup
Then(/^they enter in an invalid radio id and submit$/, () => {
    stubDeviceValidateRadioIdNotFound();
    deviceLookupEnterRadioIdAndSubmit();
});
Then(/^they should be presented with an invalid radio id error message$/, () => {
    cy.get('[data-test="ErrorMessageInvalidRadioId"]').should('be.visible');
});

// Scenario: Customer recieves invalid vin error using device lookup
Then(/^they enter in an invalid vin and submit$/, () => {
    stubDeviceValidateInvalidVin();
    cy.get('[data-test="vinLookupTypeOption"] input[type="radio"]').click({ force: true });
    cy.get('[data-test="vinInput"] input[type="text"]').clear().type('WP0AA0941HN450519');
    cy.get('[data-test="continueButton"]').click();
});
Then(/^they should be presented with an invalid vin error message$/, () => {
    cy.get('[data-test="ErrorMessageInvalidVin"]').should('be.visible');
});

// Scenario: Customer recieves invalid license plate error using device lookup
Then(/^they enter in an invalid license plate and submit$/, () => {
    stubIdentityDeviceLicensePlateNotFound();
    cy.get('[data-test="licensePlateLookupTypeOption"] input[type="radio"]').click({ force: true });
    cy.get('[data-test="licensePlateInput"] input[type="text"]').clear().type('MYTESTR');
    cy.selectValueInDropdown('[data-test="stateDropDown"]', 'CA');
    cy.get('[data-test="continueButton"]').click();
});
Then(/^they should be presented with an invalid license plate error message$/, () => {
    cy.get('[data-test="ErrorMessageInvalidLicensePlate"]').should('be.visible');
});
