export function mockRouteForCardBinRanges(): void {
    cy.route('POST', `**/services/utility/card-bin-ranges`, require('../fixtures/card-bin-ranges.json'));
}

export function mockRouteForEnvInfo(): void {
    cy.route('GET', `**/services/utility/env-info`, require('../fixtures/env-info.json'));
}

export function mockRouteForAllPackageDescriptions(): void {
    cy.route('POST', `**/services/offers/all-package-desc`, require('../fixtures/all-package-descriptions.json'));
}
