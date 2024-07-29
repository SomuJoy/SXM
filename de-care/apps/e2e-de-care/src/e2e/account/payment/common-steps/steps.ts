import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Before(() => {});

When(/^the customer enters the update-payment experience$/, () => {
    cy.visit('account/pay/make-payment?updatePayment=true');
});
Then(/^the customer should be able to update payment$/, () => {
    cy.get('[data-test="update-payment-header"]').should('exist');
});
