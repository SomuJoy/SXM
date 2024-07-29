import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import { mockStepUpAPICalls, verifyWithAccountNumber } from '../registration.helpers';

Before(() => {
    mockStepUpAPICalls();
});

Given('a customer is redirected from BAU with an existing subscription', () => {
    cy.visit('/account/registration/step-up');
});

When('the customer verifies their account with account number', () => {
    verifyWithAccountNumber();
});

Then('the customer can continue to the registration flow', () => {
    cy.url().should('contain', 'account/registration/register');
    cy.get('h4').should('have.text', 'Create security questions');
});
