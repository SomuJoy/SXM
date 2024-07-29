import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, mockRouteForEnvInfo } from '@de-care/shared/e2e';

describe('Use Case - change-subscription', () => {
    beforeEach(() => {
        cy.server();
        mockRouteForCardBinRanges();
        mockRouteForEnvInfo();
        mockRouteForAllPackageDescriptions();
    });
    describe('Scenario - purchase', () => {
        it('should show error message if user clicks submit button without making a selection', () => {
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/account`, require('../fixtures/account-with-paid-subscription.json'));
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/customer/change`, require('../fixtures/change-offers.json'));

            const subscriptionId = 10000247243;
            cy.visit(`/subscription/change?subscriptionId=${subscriptionId}`);

            cy.get('[data-e2e=multiPackageSelectionForm]').submit();
            cy.contains('Pick a package below or').should('be.visible');
        });
    });
});
