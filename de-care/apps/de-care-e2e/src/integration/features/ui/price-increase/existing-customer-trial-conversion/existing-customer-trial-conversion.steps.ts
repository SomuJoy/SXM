import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import { mockExistingTrialConversionAPICalls, verifyByRadioID, fillOutYourInfoAndPaymentForm } from '../price-increase.helpers';

Before(() => {
    mockExistingTrialConversionAPICalls();
});

Given('satellite existing customer is on a trial', () => {
    cy.visit('/subscribe/checkout/flepz?programcode=CAMOREALLACCESS');
    verifyByRadioID();
});

When('doing a trial conversion', () => {
    fillOutYourInfoAndPaymentForm();
});

Then('customer must see a price increase message', () => {
    cy.get('price-increase-message').should('be.visible');
});
