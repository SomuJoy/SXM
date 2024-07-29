import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, mockRouteForEnvInfo, mockSessionTimeout } from '@de-care/shared/e2e';
import { mockRouteForAccountWithPaidSubscription } from '../support/common-route-mocks';

describe('Use Case - cancel-subscription: cancel-request', () => {
    beforeEach(() => {
        cy.server();
        mockRouteForCardBinRanges();
        mockRouteForEnvInfo();
        mockRouteForAllPackageDescriptions();
        mockRouteForAccountWithPaidSubscription();
        const accountNumber = 10000244939;
        const subscriptionId = 10000247243;
        cy.visit(`/subscription/cancel?accountNumber=${accountNumber}&subscriptionId=${subscriptionId}`);
    });
    describe('Session timeout when submitting cancel reason', () => {
        beforeEach(() => {
            mockSessionTimeout(`${Cypress.env('microservicesEndpoint')}/services/offers/customer/cancel`);
            submitCancelReason();
        });
        it('should reload flow when session timeout modal is closed with X', () => {
            closeSessionTimeoutModalAndAssert();
        });
        it('should reload flow when session timeout modal submit button is clicked', () => {
            clickStartOverSessionTimeoutModalAndAssert();
        });
    });
    describe('Session timeout when submitting cancel', () => {
        beforeEach(() => {
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/customer/cancel`, require('../fixtures/cancel-offers.json'));
            mockSessionTimeout(`${Cypress.env('microservicesEndpoint')}/services/cancel/subscription`);

            submitCancelReason();
            cy.get('[data-e2e=declineCancelOffersButton]').click({ force: true });
            cy.get('[data-e2e=finalCancelSubscriptionButton]').click({ force: true });
        });
        it('should reload flow when session timeout modal is closed with X', () => {
            closeSessionTimeoutModalAndAssert();
        });
        it('should reload flow when session timeout modal submit button is clicked', () => {
            clickStartOverSessionTimeoutModalAndAssert();
        });
    });
});

function submitCancelReason(): void {
    cy.get('de-care-cancel-reason form input[type=radio]+label')
        .first()
        .click();
    cy.get('[data-e2e=cancelReasonForm] button[type=submit]').click();
}

function closeSessionTimeoutModalAndAssert(): void {
    cy.get('[data-e2e=sxmUiModalCloseButton]').click();
    cy.contains('Tell us why you’re thinking of leaving.').should('be.visible');
}

function clickStartOverSessionTimeoutModalAndAssert(): void {
    cy.get('[data-e2e=sessionTimeoutStartOverSubmitButton]').click();
    cy.contains('Tell us why you’re thinking of leaving.').should('be.visible');
}
