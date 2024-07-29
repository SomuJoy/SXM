import { Given, When, And, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import { fillOutFlepz, submit, verifyWithRadioID, fillOutSecurityQuestions, mockAccountFoundApiCalls, fillOutPassword } from '../registration.helpers';

Before(() => {
    mockAccountFoundApiCalls();
});

Given('a customer enters the registration flow', () => {
    cy.visit('/account/registration');
    fillOutFlepz();
});

When('the customer fills out their information and submits', () => {
    cy.url()
        .should('contain', 'account/registration/verify')
        .then(() => {
            submit('[data-e2e="verifySingleAccountButton"]');
        });
});

And('the account is found', () => {
    verifyWithRadioID();
});

Then('the user can successfully complete registration and checkout', () => {
    cy.url()
        .should('contain', '/account/registration/register')
        .then(() => {
            fillOutSecurityQuestions();
            fillOutPassword();
        });
});
