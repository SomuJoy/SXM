import { Before, Given, Then, When, And } from 'cypress-cucumber-preprocessor/steps';
import { mockBeatTheSoldAPICalls, fillOutFlepz, fillOutAccountLookup, fillOutCNAForm, fillOutSecurityQuestions, fillOutPassword } from '../registration.helpers';

Before(() => {
    mockBeatTheSoldAPICalls();
});

Given('a customer enters the registration flow', () => {
    cy.visit('/account/registration');
});

When('the customer fills out their information and submits', () => {
    fillOutFlepz();
});

And('the account is not found and the customer looks up their account', () => {
    fillOutAccountLookup();
});

Then('the customer sees the CNA page', () => {
    cy.url().should('contain', 'account/registration/cna');
});

And('the customer fills out the CNA data', () => {
    fillOutCNAForm();
});

Then('the user can complete the normal registration flow', () => {
    fillOutSecurityQuestions();
    fillOutPassword();
    cy.url().should('contain', 'account/registration/completed');
    cy.get('h4').should('have.text', 'Thanks for registering, Bat.');
});
