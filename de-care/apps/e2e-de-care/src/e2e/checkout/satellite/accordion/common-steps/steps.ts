import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then(/^they should be taken back to the payment step and shown an error message in the credit card section$/, () => {
    cy.get('[data-test="UnauthorizedCreditCardErrorMessage"]').should('be.visible');
});
Then(/^they should be taken back to the lookup step$/, () => {
    cy.get('[data-test="verifyDeviceTabs.tabs"]').should('be.visible');
});
