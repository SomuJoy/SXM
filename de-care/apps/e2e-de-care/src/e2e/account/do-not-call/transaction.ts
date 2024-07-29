import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountMgmtPreferencesDoNotCallSuccess } from '../../../support/stubs/de-microservices/account-mgmt';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Sign up for do not call
When(/^a customer visits the do not call experience and successfully completes the transaction$/, () => {
    cy.visit('donotcall');
    stubAccountMgmtPreferencesDoNotCallSuccess();
    cy.get('[data-test="DoNotCallPhoneNumberTextfield"]').clear().type('8888888888');
    cy.get('[data-test="NuCaptchaTextfield"]').clear().type('12345');
    cy.get('[data-test="DoNotCallContinueButton"]').click();
});
Then(/^they should see the thank you message$/, () => {
    cy.get('[data-test="DoNotCallSuccessTitle"]').should('be.visible');
});
