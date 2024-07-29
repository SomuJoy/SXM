import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubModifySubscriptionOptionsSuccess } from './common-utils/stubs';

// Scenario: Subscription management loads
When(/^they take action to manage a subscription$/, () => {
    stubModifySubscriptionOptionsSuccess();
    cy.get('[data-link-name="Manage|Primary"][data-link-key="ActiveSubscriptionActions"]').click({ force: true });
});
Then(/^they should see the subscription CTAs$/, () => {
    cy.get('sxm-ui-selfpay-subscription-details sxm-ui-dropdown-navigation-list button')
        .click({ force: true })
        .then(() => {
            cy.get('sxm-ui-selfpay-subscription-details sxm-ui-dropdown-navigation-list ul li').its('length').should('be.gte', 1);
        });
});
Then(/^there should be a subscription ID parameter in the url$/, () => {
    cy.url().should('contain', 'subscriptionId');
});

// Scenario: Show edit nickname if account subscription has a nickname
Then(/^the edit radio nickname button should be visible$/, () => {
    cy.get('[data-test="manageSubscriptionsHeaderEditNicknameButton"]').should('be.visible');
});
When(/^they click on the edit radio nickname link$/, () => {
    cy.get('[data-test="manageSubscriptionsHeaderEditNicknameButton"]').click({ force: true });
});
Then(/^the edit radio nickname form should be visible$/, () => {
    cy.get('[data-test="addNicknameForm"]').should('be.visible');
});

// Scenario: Infotainment section loads
Then(/^the infotainment section should be visible$/, () => {
    cy.get('[data-test="infotainmentPlansSection"]').should('be.visible');
});

// Scenario: Subscription details - audio account card shows a price change message if any plan on the subsription qualifies
Then(/^the customer should be presented with a price change message for audio subscription$/, () => {
    cy.get('[data-test="audioPriceChangeMessage"').should('be.visible');
});
