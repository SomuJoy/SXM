import { Before, Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { mockClosedRadioSubscriptionAPICalls, verifyByRadioID, validateRadioLookup, continueUpsell, useSavedVisa, continueSelectUpsell } from '../price-increase.helpers';

Before(() => {
    mockClosedRadioSubscriptionAPICalls();
});

Given('a potential customer', () => {
    cy.visit('/subscribe/checkout/flepz');
});

When('purchasing a new subscription with Follow on', () => {
    verifyByRadioID();
    validateRadioLookup();
    continueUpsell();
    useSavedVisa();
    continueSelectUpsell();
});

Then('customer must see a price increase message', () => {
    cy.get('price-increase-message').should('be.visible');
});
