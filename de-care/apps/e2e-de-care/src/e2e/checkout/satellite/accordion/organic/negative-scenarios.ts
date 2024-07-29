import { stubOffersSuccessSatelliteOrganicFallback } from '../../../../../support/stubs/de-microservices/offers';
import { Before, Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Experience handles fallback offer when programcode is empty
Given(/^a customer visits the page without a program code$/, () => {
    stubOffersSuccessSatelliteOrganicFallback();
    cy.visit(`/subscribe/checkout/flepz`);
});
Then(/^they should be presented with fallback offer, with out any alert message about a fallback offer$/, () => {
    cy.get('sxm-ui-loading-with-alert-message').should('not.exist');
    cy.get('sxm-ui-primary-package-card').should('be.visible');
});

// Scenario: Experience handles lead offer no longer available
// Given(/^a customer visits the page with a program code for an offer no longer available$/, () => {

// });
// Then(/^they should be presented with the no longer available finding another offer messaging before seeing a fallback offer$/, () => {

// });
//
// // Scenario: Experience handles expired lead offer
// Given(/^a customer visits the page with a program code for an expired offer$/, () => {

// });
// Then(/^they should be presented with the finding another offer messaging before seeing a fallback offer$/, () => {

// });
//
// // Scenario: Experience handles fallback offer when programcode is not valid
// Given(/^a customer visits the page with an invalid programcode$/, () => {

// });
//
// Then(/^they should be presented with the finding another offer for non valid program code messaging before seeing a fallback offer$/, () => {

// });
