import { Before, Given, And, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { fillOutFlepz, mockAccountNotFoundApiCalls, checkNoAccountFound } from '../registration.helpers';

Before(() => {
    mockAccountNotFoundApiCalls();
});

Given('a customer enters the registration flow', () => {
    cy.visit('/account/registration');
});

When('the customer fills out their information and submits', () => {
    fillOutFlepz();
});

And('the account is not found', () => {
    checkNoAccountFound();
});

Then('the user should have a chance to lookup their account', () => {
    cy.url().should('include', '/account/registration/lookup');
});
