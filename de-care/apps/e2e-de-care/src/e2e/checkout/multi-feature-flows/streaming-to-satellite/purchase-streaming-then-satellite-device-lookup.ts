import { Before, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountNonPiiStreamingSubscriptionClosedRadio } from '../../../../support/stubs/de-microservices/account';
import { deviceLookupEnterRadioIdAndSubmit } from './common-utils/ui';
import { stubIdentityDeviceLicensePlateFound } from '../../../../support/stubs/de-microservices/identity';
import { stubDeviceInfoNewWithVehicleSuccess, stubDeviceValidateNewSuccess } from '../../../../support/stubs/de-microservices/device';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Customer enters a valid radio id using device lookup
Then(/^they enter in a valid radio id and submit$/, () => {
    stubDeviceValidateNewSuccess();
    stubAccountNonPiiStreamingSubscriptionClosedRadio();
    deviceLookupEnterRadioIdAndSubmit();
});

// Scenario: Customer enters a valid vin using device lookup
Then(/^they enter in a valid vin and submit$/, () => {
    stubDeviceValidateNewSuccess();
    stubAccountNonPiiStreamingSubscriptionClosedRadio();
    cy.get('[data-test="vinLookupTypeOption"] input[type="radio"]').click({ force: true });
    cy.get('[data-test="vinInput"] input[type="text"]').clear().type('WP0AA0941HN450519');
    cy.get('[data-test="continueButton"]').click();
});

// Scenario: Customer recieves invalid license plate error using device lookup
Then(/^they enter in a valid license plate and submit$/, () => {
    stubIdentityDeviceLicensePlateFound();
    stubDeviceValidateNewSuccess();
    stubDeviceInfoNewWithVehicleSuccess();
    stubAccountNonPiiStreamingSubscriptionClosedRadio();
    cy.get('[data-test="licensePlateLookupTypeOption"] input[type="radio"]').click({ force: true });
    cy.get('[data-test="licensePlateInput"] input[type="text"]').clear().type('MYTESTR');
    cy.selectValueInDropdown('[data-test="stateDropDown"]', 'CA');
    cy.get('[data-test="continueButton"]').click();
});
Then(/^they confirm their vin$/, () => {
    cy.get('[data-test="ConfirmVinModalVinNumber"]').should('be.visible');
    cy.get('[data-test="ConfirmVinModalLicensePlate"]').should('be.visible');
    cy.get('[data-test="ConfirmVinModalContinue"]').click();
});
