import { Before, Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountSuccess } from './common-utils/stubs';
import { stubAuthenticateLoginSuccess, stubAuthenticateLoginThirdPartyPartner } from '../../../support/stubs/de-microservices/authenticate';

Before(() => {});

// Common steps
Given(/^a customer visits the my account login page$/, () => {
    cy.visit('/account/login');
});

// Scenario: Login success goes to dashboard
When(/^they login using valid credentials$/, () => {
    stubAuthenticateLoginSuccess();
    stubAccountSuccess();
    fillOutLoginFormAndSubmit();
});

// Scenario: Login shows partner message
When(/^they login using credentials tied to a partner account$/, () => {
    stubAuthenticateLoginThirdPartyPartner();
    fillOutLoginFormAndSubmit();
});
Then(/^they should see a message about using the partner site for login$/, () => {
    cy.get('[data-test="loginFormPartnerNotificationTitle"]').should('be.visible');
});

const fillOutLoginFormAndSubmit = () => {
    cy.get('[data-test="loginFormUsernameField"]').clear().type('tester@siriusxm.com');
    cy.get('[data-test="loginFormPasswordField"]').clear().type('@ABCqwe123!');
    cy.get('[data-test="loginFormSubmitButton"]').click();
};
