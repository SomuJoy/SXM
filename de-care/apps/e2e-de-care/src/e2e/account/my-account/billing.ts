import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import {
    stubValidateEmailSuccess,
    stubSubscriptionBillingActivitySuccess,
    stubPaymentBillingActivitySuccess,
    stubSubscriptionBillingActivityNoDataSuccess,
} from './common-utils/stubs';

When(/^they navigate to the billing section$/, () => {
    stubValidateEmailSuccess();
    stubSubscriptionBillingActivitySuccess();
    cy.visit('/account/manage/billing');
});
When(/^they navigate to the billing section with an account with no billing data$/, () => {
    stubValidateEmailSuccess();
    stubSubscriptionBillingActivityNoDataSuccess();
    cy.visit('/account/manage/billing');
});
Then(/^they should be routed to the billing experience$/, () => {
    cy.url().should('contain', '/billing');
});
Then(/^they should see a message that says they have no data$/, () => {
    cy.get('[data-test="noDataRow"]').should('be.visible');
});
