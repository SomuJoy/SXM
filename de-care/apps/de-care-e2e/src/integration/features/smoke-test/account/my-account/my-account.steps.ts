import { Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

export const mockResponses = {
    account: require('../../../../../fixtures/features/smoke-tests/account/my-account/account.json'),
    trending: require('../../../../../fixtures/features/smoke-tests/account/my-account/new-hot-and-trending.json'),
    modifySubscriptionOptions: require('../../../../../fixtures/features/smoke-tests/account/my-account/modify-subscription-options.json'),
};

Before(() => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
});

Given(/^a customer visits the my account experience while logged in$/, () => {
    cy.viewport(1024, 1200);
    cy.intercept('POST', '**/account', mockResponses.account);
    cy.intercept(
        'GET',
        '**/phx/services/v1/rest/sites/sxm/types/SXMContentGroup?filter=name:equals:CG%20Section%204%20-%20Home%20Variant%20Mock%20-%20Promos',
        mockResponses.trending
    );
    cy.visit('/account/manage');
});
Then(/^they should be routed to the dashboard experience$/, () => {
    cy.url().should('contain', '/dashboard');
});

When(/^they take action to manage a subscription$/, () => {
    cy.intercept('POST', '**/account-mgmt/modify-subscription-options', mockResponses.modifySubscriptionOptions);
    cy.get('[data-link-name="Manage|Primary"][data-link-key="ActiveSubscriptionActions"]').click({ force: true });
});
Then(/^they should see the subscription CTAs$/, () => {
    cy.get('sxm-ui-selfpay-subscription-details sxm-ui-dropdown-navigation-list button')
        .click({ force: true })
        .then(() => {
            cy.get('sxm-ui-selfpay-subscription-details sxm-ui-dropdown-navigation-list ul li').its('length').should('be.gte', 1);
        });
});
