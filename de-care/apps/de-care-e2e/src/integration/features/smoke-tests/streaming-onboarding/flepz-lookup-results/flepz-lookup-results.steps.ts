import { Before, Given, Then } from 'cypress-cucumber-preprocessor/steps';

export const mockResponses = {
    noMatch: require('../../../../../fixtures/features/smoke-tests/streaming-onboarding/streaming-flepz-no-match.json'),
    singleMatchHasCredentials: require('../../../../../fixtures/features/smoke-tests/streaming-onboarding/streaming-flepz-single-match-existing-credentials.json'),
    singleMatchNeedsCredentials: require('../../../../../fixtures/features/smoke-tests/streaming-onboarding/streaming-flepz-single-match-no-credentials.json'),
    multipleMatch: require('../../../../../fixtures/features/smoke-tests/streaming-onboarding/streaming-flepz-multiple-match.json'),
};

export const fillOutFlepzAndSubmit = () => {
    // NOTE: These values don't matter here because we mock the endpoint response (it doesn't use the request values).
    //       We just need to fill out the form fields with valid data.
    cy.get('[data-e2e="FlepzFirstNameTextfield"]').type('Mikey');
    cy.get('[data-e2e="FlepzLastNameTextfield"]').type('Cypress');
    cy.get('[data-e2e="FlepzEmailTextfield"]').type('mikebeetest@testing.com');
    cy.get('[data-e2e="FlepzPhoneNumberTextfield"]').type('8059999999');
    cy.get('[data-e2e="FlepzZipCodeTextfield"]').type('12345');
    cy.get('[data-e2e="FlepzFormSubmitButton"]').click();
};

Before(() => {
    cy.server();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
    cy.visit('/onboarding/setup-credentials');
});

Given(/^A customer submits the FLEPZ form with no match data$/, () => {
    cy.route('POST', `**/identity/streaming/flepz`, mockResponses.noMatch);
    fillOutFlepzAndSubmit();
});
Then(/^the customer should be navigated to the page for no match$/, () => {
    cy.url().should('contain', '/onboarding/setup-credentials/no-match');
});

Given(/^A customer submits the FLEPZ form with single match needing credentials data$/, () => {
    cy.route('POST', `**/identity/streaming/flepz`, mockResponses.singleMatchNeedsCredentials);
    fillOutFlepzAndSubmit();
});
Then(/^the customer should be navigated to the page for create credentials$/, () => {
    cy.url().should('contain', '/onboarding/setup-credentials/credential-setup');
});

Given(/^A customer submits the FLEPZ form with multiple match data$/, () => {
    cy.route('POST', `**/identity/streaming/flepz`, mockResponses.multipleMatch);
    fillOutFlepzAndSubmit();
});
Then(/^the customer should be navigated to the page for multiple matches$/, () => {
    cy.url().should('contain', '/onboarding/setup-credentials/multiple-subscriptions-page');
});

Given(/^A customer submits the FLEPZ form with single match has credentials data$/, () => {
    cy.route('POST', `**/identity/streaming/flepz`, mockResponses.singleMatchHasCredentials);
    fillOutFlepzAndSubmit();
});
Then(/^the customer should be navigated to the page for existing credentials$/, () => {
    cy.url().should('contain', '/onboarding/setup-credentials/existing-credentials');
});
