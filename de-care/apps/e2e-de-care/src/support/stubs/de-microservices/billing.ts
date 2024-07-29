export const stubBillingActivitySuccess = () => {
    cy.intercept('POST', '**/services/billing/activity', { fixture: 'de-microservices/billing/activity/success.json' });
};
