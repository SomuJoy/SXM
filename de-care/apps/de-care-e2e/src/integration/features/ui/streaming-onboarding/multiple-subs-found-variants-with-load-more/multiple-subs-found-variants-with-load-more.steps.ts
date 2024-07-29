import { Before, Given, Then } from 'cypress-cucumber-preprocessor/steps';

export const mockResponses = {
    plansWithoutStreaming: require('../../../../../fixtures/features/ui/streaming-onboarding/streaming-flepz-multiple-match-plans-without-streaming-more-than-three.json'),
    plansThatAreInactive: require('../../../../../fixtures/features/ui/streaming-onboarding/streaming-flepz-multiple-match-plans-that-are-inactive-more-than-three.json'),
    plansWithStreaming: require('../../../../../fixtures/features/ui/streaming-onboarding/streaming-flepz-multiple-match-plans-with-streaming-more-than-three.json'),
    plansWithEveryVariant: require('../../../../../fixtures/features/ui/streaming-onboarding/streaming-flepz-multiple-match-plans-with-every-variant-more-than-three.json'),
    plansWithEveryVariantButStreaming: require('../../../../../fixtures/features/ui/streaming-onboarding/streaming-flepz-multiple-match-plans-with-every-variant-but-streaming.json'),
    plansWithEveryVariantAndThreeStreaming: require('../../../../../fixtures/features/ui/streaming-onboarding/streaming-flepz-multiple-match-plans-with-every-variant-and-three-streaming.json'),
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

Given(/^A customer lands on the multiple results page with subscriptions that do not have streaming support$/, () => {
    cy.route('POST', `**/identity/streaming/flepz`, mockResponses.plansWithoutStreaming);
    fillOutFlepzAndSubmit();
});
Then(/^the customer should be presented with the upgrade headline messaging$/, () => {
    cy.get('[data-e2e="StreamingFlepzMultipleSubscriptions.UpgradeNeededHeadlineContent"]').should('be.visible');
});

Given(/^A customer lands on the multiple results page with inactive subscriptions$/, () => {
    cy.route('POST', `**/identity/streaming/flepz`, mockResponses.plansThatAreInactive);
    fillOutFlepzAndSubmit();
});
Then(/^the customer should be presented with the reactivate headline messaging$/, () => {
    cy.get('[data-e2e="StreamingFlepzMultipleSubscriptions.InactiveHeadlineContent"]').should('be.visible');
});

Given(/^A customer lands on the multiple results page with subscriptions with streaming support$/, () => {
    cy.route('POST', `**/identity/streaming/flepz`, mockResponses.plansWithStreaming);
    fillOutFlepzAndSubmit();
});
Then(/^the customer should be presented with the start listening headline messaging$/, () => {
    cy.get('[data-e2e="StreamingFlepzMultipleSubscriptions.WithStreamingHeadlineContent"]').should('be.visible');
});

Given(/^A customer lands on the multiple results page with subscriptions with streaming support and all other variants$/, () => {
    cy.route('POST', `**/identity/streaming/flepz`, mockResponses.plansWithEveryVariant);
    fillOutFlepzAndSubmit();
});
Then(/^the customer should be presented with the other subscriptions headline messaging$/, () => {
    cy.get('[data-e2e="StreamingFlepzMultipleSubscriptions.OtherAccountsHeadlineContent"]').should('be.visible');
});
Then(/^the customer should be presented with the load more button$/, () => {
    cy.get('[data-e2e="StreamingFlepzMultipleSubscriptions.LoadMoreButton"]').should('exist');
});
Then(/^the customer should be presented with the other subscriptions sub-headline messaging$/, () => {
    cy.get('[data-e2e="StreamingFlepzMultipleSubscriptions.OtherAccountsSubHeadlineContent"]').should('be.visible');
});

Given(/^A customer lands on the multiple results page with subscriptions that do not have streaming support and inactive subscriptions$/, () => {
    cy.route('POST', `**/identity/streaming/flepz`, mockResponses.plansWithEveryVariantButStreaming);
    fillOutFlepzAndSubmit();
});

Given(/^A customer lands on the multiple results page with subscriptions with only streaming support visible and all other variants$/, () => {
    cy.route('POST', `**/identity/streaming/flepz`, mockResponses.plansWithEveryVariantAndThreeStreaming);
    fillOutFlepzAndSubmit();
});
Then(/^the customer should not be presented with the other subscriptions sub-headline messaging$/, () => {
    cy.get('[data-e2e="StreamingFlepzMultipleSubscriptions.OtherAccountsSubHeadlineContent"]').should('not.exist');
});
Then(/^the customer should be presented with the other subscriptions sub-headline messaging after loading more$/, () => {
    cy.get('[data-e2e="StreamingFlepzMultipleSubscriptions.LoadMoreButton"]')
        .click({ force: true })
        .then(() => {
            cy.get('[data-e2e="StreamingFlepzMultipleSubscriptions.OtherAccountsSubHeadlineContent"]').should('be.visible');
        });
});