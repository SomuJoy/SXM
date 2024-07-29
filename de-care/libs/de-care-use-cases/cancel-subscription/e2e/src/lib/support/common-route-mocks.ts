import { mockRoutesFromHAR } from '@de-care/shared/e2e';

export function mockRouteForAccountWithPaidSubscription(): void {
    cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/account`, require('../fixtures/account-with-paid-subscription.json'));
}

export function mockRouteForAccountWithPaidSubscription12MonthsAllAccess(): void {
    cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/account`, require('../fixtures/account-with-paid-subscription-12-months-all-access.json'));
}

export function mockRouteForGroupedOffersChoiceStreaming(): void {
    cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/customer/cancel`, require('../fixtures/cancel-quotes-grouped-offers-choice-streaming.json'));
}

export function mockRoutesForChangePlanSuccess(): void {
    mockRoutesFromHAR(require('../fixtures/cancel-online-accept-offer-success.har.json'));
}

export function mockCancelAcceptChoiceStreamingFullTransaction() {
    mockRoutesFromHAR(require('../fixtures/cancel-accept-choice-offer-complete-transaction.har.json'));
}
