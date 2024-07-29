import { cyGetHeroComponentHeading, mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, mockRouteForEnvInfo } from '@de-care/shared/e2e';
import { selectCancelReasonAndSubmit } from '../support/helpers';
import { mockRouteForAccountWithPaidSubscription } from '../support/common-route-mocks';

describe('Use Case - cancel-subscription', () => {
    beforeEach(() => {
        cy.server();
        mockRouteForCardBinRanges();
        mockRouteForEnvInfo();
        mockRouteForAllPackageDescriptions();
        mockRouteForAccountWithPaidSubscription();
    });
    describe('Scenario - cancel-request', () => {
        it('should show error message if user clicks switch subscription button without making a selection', () => {
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/customer/cancel`, require('../fixtures/cancel-offers.json'));
            cy.visit(`/subscription/cancel?accountNumber=10000244939&subscriptionId=10000247243`);

            selectCancelReasonAndSubmit();
            cy.get('[data-e2e=multiPackageSelectionForm]').submit();
            cy.contains('Select an offer below').should('be.visible');
        });
        it('should show other subscription options when no offers', () => {
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/customer/cancel`, require('../fixtures/cancel-no-offers.json'));
            cy.visit(`/subscription/cancel?accountNumber=10000244939&subscriptionId=10000247243`);

            selectCancelReasonAndSubmit();
            cy.contains('You still have other subscription options').should('be.visible');
        });
        it('should skip offers step when cancelOnline is in URL', () => {
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/customer/cancel`, require('../fixtures/cancel-no-offers.json'));
            cy.visit(`/subscription/cancel?accountNumber=10000244939&subscriptionId=10000247243&cancelOnline=true`);

            selectCancelReasonAndSubmit();
            cy.get('[data-e2e="finalCancelSubscriptionButton"]').should('exist');
        });
        it('should show the correct hero text for each step', () => {
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/customer/cancel`, require('../fixtures/cancel-offers.json'));
            cy.visit(`/subscription/cancel?accountNumber=10000244939&subscriptionId=10000247243`);

            assertHeroText('Before you go...');
            selectCancelReasonAndSubmit();
            assertHeroText('One last option to consider...');
            cy.get('[data-e2e=multiPackageSelectionForm] input[type=radio]+label')
                .first()
                .click();
            cy.get('[data-e2e=multiPackageSelectionForm]').submit();
            assertHeroText('Change your subscription');

            cy.visit(`/subscription/cancel?accountNumber=10000244939&subscriptionId=10000247243`);
            selectCancelReasonAndSubmit();
            cy.get('[data-e2e="declineCancelOffersButton"]').click({ force: true });
            assertHeroText('We’re sorry to see you go');
        });
    });
});

function assertHeroText(text: string): void {
    cyGetHeroComponentHeading().should(elem => expect(elem.text()).to.contain(text));
}
