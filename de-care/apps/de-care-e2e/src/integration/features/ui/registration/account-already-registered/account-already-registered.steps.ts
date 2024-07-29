import { Before, Given, When, And, Then } from 'cypress-cucumber-preprocessor/steps';
import { fillOutFlepz, mockAccountAlreadyRegisteredAPICalls, assertAlreadyRegisteredUI, submit } from '../registration.helpers';

Before(() => {
    mockAccountAlreadyRegisteredAPICalls();
});

Given('a customer enters the registration flow', () => {
    cy.visit('/account/registration');
});

When('the customer fills out their information and submits', () => {
    fillOutFlepz();
});

And('the account is found and already registered', () => {
    cy.url()
        .should('contain', 'account/registration/verify')
        .then(() => {
            submit('[data-e2e="verifySingleAccountButton"]');
        });
});

Then('the user is presented the account already registered ui', () => {
    assertAlreadyRegisteredUI();
});
