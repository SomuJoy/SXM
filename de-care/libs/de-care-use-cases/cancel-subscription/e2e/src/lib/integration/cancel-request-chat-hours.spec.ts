import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, mockRouteForEnvInfo } from '@de-care/shared/e2e';
import { mockRouteForAccountWithPaidSubscription } from '../support/common-route-mocks';

describe('Use Case - cancel-subscription', () => {
    beforeEach(() => {
        cy.server();
        mockRouteForCardBinRanges();
        mockRouteForEnvInfo();
        mockRouteForAllPackageDescriptions();
        mockRouteForAccountWithPaidSubscription();
        cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/customer/cancel`, require('../fixtures/cancel-offers.json'));
    });
    describe('Scenario - cancel-request', () => {
        it('should show chat link during chat hours', () => {
            cy.clock(Date.UTC(2020, 1, 1, 14), ['Date']); /* Wednesday 10am EST */

            const accountNumber = 10000188993;
            const subscriptionId = 10000191297;
            cy.visit(`/subscription/cancel?accountNumber=${accountNumber}&subscriptionId=${subscriptionId}`);

            cy.get('de-care-cancel-reason form input[type=radio]+label')
                .first()
                .click();
            // TODO: looks like cancel reason component has an expressionChangedAfter issue that can be seen if using submit
            //       but not when trying to find button and clicking...probably due to the short delay allowing for CD zone tick to occur
            //       We should fix that component and can use this to confirm the fix
            // cy.get('[data-e2e=cancelReasonForm]').submit();
            cy.get('[data-e2e=cancelReasonForm] button[type=submit]').click();
            cy.get('#chat-to-cancel').should('exist');
        });

        it('should hide chat link and show chat closed copy during off chat hours', () => {
            cy.clock(Date.UTC(2020, 1, 1, 7), ['Date']); /* Wednesday 3am EST */

            const accountNumber = 10000188993;
            const subscriptionId = 10000191297;
            cy.visit(`/subscription/cancel?accountNumber=${accountNumber}&subscriptionId=${subscriptionId}`);

            cy.get('de-care-cancel-reason form input[type=radio]+label')
                .first()
                .click();
            // TODO: looks like cancel reason component has an expressionChangedAfter issue that can be seen if using submit
            //       but not when trying to find button and clicking...probably due to the short delay allowing for CD zone tick to occur
            //       We should fix that component and can use this to confirm the fix
            // cy.get('[data-e2e=cancelReasonForm]').submit();
            cy.get('[data-e2e=cancelReasonForm] button[type=submit]').click();
            cy.get('#chat-to-cancel').should('not.exist');
            cy.contains('Chat is now closed').should('be.visible');
        });
    });
});
