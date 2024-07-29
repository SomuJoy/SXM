import { Before, Given, Then } from 'cypress-cucumber-preprocessor/steps';

export const mockResponses = {
    noMatch: require('../../../../../fixtures/features/smoke-tests/streaming-onboarding/streaming-flepz-no-match.json'),
    singleMatchHasCredentials: require('../../../../../fixtures/features/smoke-tests/streaming-onboarding/streaming-flepz-single-match-existing-credentials.json'),
    singleMatchNeedsCredentials: require('../../../../../fixtures/features/smoke-tests/streaming-onboarding/streaming-flepz-single-match-no-credentials.json'),
    multipleMatch: require('../../../../../fixtures/features/smoke-tests/streaming-onboarding/streaming-flepz-multiple-match.json'),
};

// NOTE: These values don't matter here because we mock the endpoint response (it doesn't use the request values).
//       We just need to provide data in the valid format
const flepzData = btoa(
    JSON.stringify({
        firstName: 'Mikey',
        lastName: 'Cypress',
        email: 'mikebeetest@testing.com',
        phoneNumber: 8059999999,
        zipCode: '12345',
    })
);

Before(() => {
    cy.server();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
});

Given(/^A customer visits the lookup URL with FLEPZ data that results in no match data$/, () => {
    cy.route('POST', `**/identity/streaming/flepz`, mockResponses.noMatch);
    cy.visit(`/onboarding/setup-credentials/lookup?flepz=${flepzData}`);
});
Then(/^the customer should be navigated to the page for no match$/, () => {
    cy.url().should('contain', '/onboarding/setup-credentials/no-match');
});

Given(/^A customer visits the lookup URL with FLEPZ data that results in single match needing credentials data$/, () => {
    cy.route('POST', `**/identity/streaming/flepz`, mockResponses.singleMatchNeedsCredentials);
    cy.visit(`/onboarding/setup-credentials/lookup?flepz=${flepzData}`);
});
Then(/^the customer should be navigated to the page for create credentials$/, () => {
    cy.url().should('contain', '/onboarding/setup-credentials/credential-setup');
});

Given(/^A customer visits the lookup URL with FLEPZ data that results in single match has credentials data$/, () => {
    cy.route('POST', `**/identity/streaming/flepz`, mockResponses.singleMatchHasCredentials);
    cy.visit(`/onboarding/setup-credentials/lookup?flepz=${flepzData}`);
});
Then(/^the customer should be navigated to the page for multiple matches$/, () => {
    cy.url().should('contain', '/onboarding/setup-credentials/multiple-subscriptions-page');
});

Given(/^A customer visits the lookup URL with FLEPZ data that results in multiple match data$/, () => {
    cy.route('POST', `**/identity/streaming/flepz`, mockResponses.multipleMatch);
    cy.visit(`/onboarding/setup-credentials/lookup?flepz=${flepzData}`);
});
Then(/^the customer should be navigated to the page for existing credentials$/, () => {
    cy.url().should('contain', '/onboarding/setup-credentials/existing-credentials');
});

Given(/^A customer visits the lookup URL with an invalid FLEPZ data value$/, () => {
    cy.visit(`/onboarding/setup-credentials/lookup?flepz=AnInvalidValue`);
});
Given(/^A customer visits the lookup URL with no FLEPZ data query param$/, () => {
    cy.visit(`/onboarding/setup-credentials/lookup`);
});
Then(/^the customer should be navigated to the page for find account$/, () => {
    cy.location('pathname').should('eq', '/onboarding/setup-credentials');
});
