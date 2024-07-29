import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

// Scenario: Dashboard loads an offer for an account with an active subscription
Then(/^they should be shown an offer$/, () => {
    cy.get('[data-test="offerCard"]').should('be.visible');
});

// Scenario: Dashboard routes to subscription page
When(/^they take action to view all subscriptions$/, () => {
    cy.get('[data-test="linkToViewAllSubscriptions"]').click({ force: true });
});

Then(/^they should be routed to the subscriptions page$/, () => {
    cy.url().should('contain', '/subscriptions');
});

// Scenario: Dashboard presents three subscription cards
Then(/^they should be shown three subscriptions cards$/, () => {
    cy.get('[data-test="dashboardSubscriptionCard"')
        .should('have.length', 3)
        .each(($card) => {
            cy.wrap($card).should('be.visible');
        });
});

// Scenario: Account shell shows a price change message if any plan on the account qualifies
Then(/^the customer should be presented with a price change message$/, () => {
    cy.get('[data-test="priceChangeMessage"').should('be.visible');
});

// Scenario: Dashboard presents platinum two device bundle overlay for next or forward plans
Then(/^the customer should be presented with a platinum bundle overlay when user has only one next or forward plan$/, () => {
    cy.get('[data-test="platinumTwoDeviceBundle"').should('be.visible');
});
