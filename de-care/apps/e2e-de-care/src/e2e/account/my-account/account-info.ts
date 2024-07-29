import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { beforeVisitSection } from './common-steps/steps';
import { stubAccountSuccess } from './common-utils/stubs';

import { stubAccountNextBestActionSuccessWithNoActions } from '../../../support/stubs/de-microservices/account';

// Account Info loads
When(/^they navigate to the account info section$/, () => {
    beforeVisitSection();
    cy.visit('/account/manage/account-info');
    stubAccountSuccess();
    stubAccountNextBestActionSuccessWithNoActions();
});
Then(/^they should be routed to the account info experience$/, () => {
    cy.url().should('contain', '/account-info');
});

// Edit Account Login loads
When(/^they navigate to the edit account login section$/, () => {
    beforeVisitSection();
    cy.visit('/account/manage/account-info/account-information/edit-account-login');
    stubAccountSuccess();
    stubAccountNextBestActionSuccessWithNoActions();
});
Then(/^they should be routed to the edit account login experience$/, () => {
    cy.url().should('contain', '/edit-account-login');
});

// Edit Account Login loads
When(/^they navigate to the edit billing address section$/, () => {
    beforeVisitSection();
    cy.visit('/account/manage/account-info/account-information/edit-billing-address');
    stubAccountSuccess();
    stubAccountNextBestActionSuccessWithNoActions();
});
Then(/^they should be routed to the edit billing address experience$/, () => {
    cy.url().should('contain', '/edit-billing-address');
});
