import { Before, Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { appEventDataHasBusinessErrorRecord } from '@de-care/shared/e2e';
import { goToRadioIdVinLookup, servicesUrlPrefix } from '../../../../../support/helpers';

Before(() => {
    cy.server();
    cy.route('GET', `${servicesUrlPrefix}/utility/env-info`, require('../../../../../fixtures/features/analytics/streaming-onboarding/env-info.json'));
    cy.route('POST', `${servicesUrlPrefix}/offers/all-package-desc`, require('../../../../../fixtures/features/analytics/streaming-onboarding/all-package-descriptions.json'));
    cy.visit('/setup-credentials/find-account');
});

Given(/^A customer submits the radio id or vin form with no match data$/, () => {
    goToRadioIdVinLookup();
    cy.route({
        method: 'POST',
        url: `${servicesUrlPrefix}/device/validate`,
        status: 400,
        response: require('../../../../../fixtures/features/analytics/streaming-onboarding/device-validate-radio-id-not-found.json')
    });
    cy.get('[data-e2e="RadioIdVinTextfield"] input').type('84EPYD4U');
    cy.get('[data-e2e="SearchRadioIdVinFormSubmitButton"]').click();
});
Then(/^the EDDL should contain a business error entry for no radio match found$/, () => {
    appEventDataHasBusinessErrorRecord({ errorCode: 'INVALID_DEVICE_ID', errorName: 'No radio match found' });
});

Given(/^A customer submits the radio id or vin form with an invalid VIN$/, () => {
    goToRadioIdVinLookup();
    cy.route({
        method: 'POST',
        url: `${servicesUrlPrefix}/device/validate`,
        status: 400,
        response: require('../../../../../fixtures/features/analytics/streaming-onboarding/device-validate-invalid-vin.json')
    });
    cy.get('[data-e2e="RadioIdVinTextfield"] input').type('KM8JUCAC3DU757357');
    cy.get('[data-e2e="SearchRadioIdVinFormSubmitButton"]').click();
});
Then(/^the EDDL should contain a business error entry for invalid VIN found$/, () => {
    appEventDataHasBusinessErrorRecord({ errorCode: 'INVALID_MISSING_VIN', errorName: 'Invalid VIN Lookup' });
});
