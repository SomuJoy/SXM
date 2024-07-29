import { mockRoutesFromHAR } from '@de-care/shared/e2e';

const servicesUrlPrefix = `${Cypress.env('microservicesEndpoint')}/services`;

export function mockRoutesForCustomerSuccessfullyPurchasesChoice(): void {
    mockRoutesFromHAR(require('../fixtures/customer-successfully-purchases-choice.har.json'));
}

export function mockRoutesForChoiceFollowOnSelectedInPlanGrid(): void {
    mockRoutesFromHAR(require('../fixtures/choice-follow-on-selected-in-plan-grid.har.json'));
}

export function mockRoutesForOrganicRtcProactiveTargetedSuccess(): void {
    mockRoutesFromHAR(require('../fixtures/RTC-proactive-organic.har.json'));
}

export function mockRoutesForOrganicRtcProactiveTargetedPlansNotAvailable(): void {
    mockRoutesFromHAR(require('../fixtures/RTC-proactive-organic-plans-not-available.har.json'));
}

export function mockRadioIdRenewalRequest(): void {
    cy.route('POST', `${servicesUrlPrefix}/services/offers/renewal`, require('../fixtures/radio-id-renewal.json')).as('POST-ServicesOffersRenewal');
}

export function mockCustomerOfferedRTCNotEligibleForChoice(): void {
    mockRoutesFromHAR(require('../fixtures/customer-offered-rtc-not-eligible-for-choice.har.json'));
}

export function mockCustomerDidNotSelectChoiceFromGrid(): void {
    mockRoutesFromHAR(require('../fixtures/customer-did-not-select-choice-from-grid.har.json'));
}
