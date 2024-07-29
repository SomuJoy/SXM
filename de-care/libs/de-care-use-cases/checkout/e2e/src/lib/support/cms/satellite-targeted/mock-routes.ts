const servicesUrlPrefix = `${Cypress.env('microservicesEndpoint')}/services`;

export function mockRouteForDeviceValidate(): void {
    cy.route('POST', `${servicesUrlPrefix}/device/validate`, require('../../../fixtures/cms/satellite-targeted/validate.json'));
}

export function mockRouteForNonPii(): void {
    cy.route('POST', `${servicesUrlPrefix}/account/non-pii`, require('../../../fixtures/cms/satellite-targeted/non-pii.json'));
}

export function mockRouteForOffersCustomer(): void {
    cy.route('POST', `${servicesUrlPrefix}/offers/customer`, require('../../../fixtures/cms/satellite-targeted/offers-customer.json'));
}

export function mockRouteForOffersUpsell(): void {
    cy.route('POST', `${servicesUrlPrefix}/offers/upsell`, require('../../../fixtures/cms/satellite-targeted/upsells.json'));
}

export function mockRouteForOffersInfo(): void {
    cy.route('POST', `${servicesUrlPrefix}/offers/info`, require('../../../fixtures/cms/satellite-targeted/offers-info.json'));
}

export function mockRouteForUpsellOffersInfo(): void {
    cy.route('POST', `${servicesUrlPrefix}/offers/upsell/info`, require('../../../fixtures/cms/satellite-targeted/offers-upsell-info.json'));
}
