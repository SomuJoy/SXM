import { Before, Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { appEventDataHasFrontEndErrorRecord } from '@de-care/shared/e2e';
import {
    fillOutFlepzWithGeneralData,
    getToRegistration,
    goToRegistrationCredentials,
    goToRegistrationSecurityQuestions,
    servicesUrlPrefix
} from '../../../../../support/helpers';

Before(() => {
    cy.server();
    cy.route('GET', `${servicesUrlPrefix}/utility/env-info`, require('../../../../../fixtures/features/analytics/streaming-onboarding/env-info.json'));
    cy.route('POST', `${servicesUrlPrefix}/offers/all-package-desc`, require('../../../../../fixtures/features/analytics/streaming-onboarding/all-package-descriptions.json'));
    cy.visit('/setup-credentials/find-account');
});

Given(/^A customer submits the FLEPZ form with no fields filled out$/, () => {
    cy.get('[data-e2e="FlepzFormSubmitButton"]').click();
});
Then(/^the EDDL should contain a front end error entry for FLEPZ form fields$/, () => {
    appEventDataHasFrontEndErrorRecord([
        'Auth - Missing or invalid first name',
        'Auth - Missing or invalid last name',
        'Auth - Missing or invalid email',
        'Auth - Missing or invalid phone number',
        'Auth - Missing or invalid zip code'
    ]);
});

Given(/^A customer submits the radio id or vin form with an empty value$/, () => {
    cy.route(
        'POST',
        `${servicesUrlPrefix}/identity/streaming/flepz`,
        require('../../../../../fixtures/features/analytics/streaming-onboarding/streaming-flepz-no-match.json')
    );
    fillOutFlepzWithGeneralData();
    cy.get('[data-e2e="FlepzFormSubmitButton"]').click();
    cy.get('[data-e2e="SearchRadioIdVinFormSubmitButton"]').click();
});
Then(/^the EDDL should contain a front end error entry for Auth - Missing or invalid radio ID\/VIN$/, () => {
    appEventDataHasFrontEndErrorRecord(['Auth - Missing or invalid radio ID/VIN']);
});

Given(/^A customer submits the create credentials form with no fields filled out$/, () => {
    cy.route(
        'POST',
        `${servicesUrlPrefix}/identity/streaming/flepz`,
        require('../../../../../fixtures/features/analytics/streaming-onboarding/streaming-flepz-single-match.json')
    );
    fillOutFlepzWithGeneralData();
    cy.get('[data-e2e="FlepzFormSubmitButton"]').click();
    cy.get('[data-e2e="CreateCredentialsFormSubmitButton"]').click();
});
Then(/^the EDDL should contain a front end error entry for create credentials form fields$/, () => {
    // NOTE - username is pre-filled so we are only expecting a password error here
    appEventDataHasFrontEndErrorRecord(['Registration - Missing password']);
});

Given(/^A customer submits the registration address form with no fields filled out$/, () => {
    getToRegistration();
    // Clear out the fields we autofill from flepz
    cy.get('[data-e2e="CCZipCode"]').clear();
    cy.get('[data-e2e="sxmUIPhoneNumber"]').clear();
    cy.get('[data-e2e="RegistrationAddressSubmitButton"]').click();
});
Then(/^the EDDL should contain a front end error entries for address and phone number form fields$/, () => {
    appEventDataHasFrontEndErrorRecord([
        'Registration - Missing street address',
        'Registration - Missing city',
        'Registration - Missing state',
        'Registration - Missing or invalid zip code',
        'Registration - Missing or invalid phone number'
    ]);
});

Given(/^A customer submits the registration credentials form with no fields filled out$/, () => {
    goToRegistrationCredentials();
    cy.get('[data-e2e="RegistrationCredentialsSubmitButton"]').click();
});
Then(/^the EDDL should contain a front end error entries for credentials form fields$/, () => {
    appEventDataHasFrontEndErrorRecord(['Registration - Missing username/email', 'Registration - Missing password']);
});

Given(/^A customer submits the registration security questions form with no fields filled out$/, () => {
    goToRegistrationSecurityQuestions();
    cy.get('[data-e2e="RegistrationSecurityQuestionsSubmitButton"]').click();
});
Then(/^the EDDL should contain a front end error entries for security questions form fields$/, () => {
    appEventDataHasFrontEndErrorRecord([
        'Registration - Security Question not selected for question 1',
        'Registration - Security Question not selected for question 2',
        'Registration - Security Question not selected for question 3',
        'Registration - Missing Security Question answer for question 1',
        'Registration - Missing Security Question answer for question 2',
        'Registration - Missing Security Question answer for question 3'
    ]);
});
