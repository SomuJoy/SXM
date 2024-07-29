import { assertBillingTermStepInActiveText, selectBillingTermOptionAndSubmit, selectCancelReasonAndSubmit, selectChangePlanOptionAndSubmit } from '../support/helpers';
import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, mockRouteForEnvInfo } from '@de-care/shared/e2e';
import { mockRouteForAccountWithPaidSubscription } from '../support/common-route-mocks';

describe('Use Case - cancel-subscription', () => {
    beforeEach(() => {
        cy.server();
        mockRouteForCardBinRanges();
        mockRouteForEnvInfo();
        mockRouteForAllPackageDescriptions();
        mockRouteForAccountWithPaidSubscription();
        cy.route(
            'POST',
            `${Cypress.env('microservicesEndpoint')}/services/offers/customer/cancel`,
            require('../fixtures/cancel-offers-plans-with-different-term-lengths.json')
        );
    });
    describe('Change plan scenario', () => {
        it('should correctly present pay up front annual term length', () => {
            cy.visit(`/subscription/cancel?accountNumber=10001086651&subscriptionId=10001085883`);
            selectCancelReasonAndSubmit();
            selectChangePlanOptionAndSubmit(1);
            selectBillingTermOptionAndSubmit(0);
            assertBillingTermStepInActiveText('Annual - $96.00/yr');
        });
        it('should correctly present pay up front semi-annual term length', () => {
            cy.visit(`/subscription/cancel?accountNumber=10001086651&subscriptionId=10001085883`);
            selectCancelReasonAndSubmit();
            selectChangePlanOptionAndSubmit(1);
            selectBillingTermOptionAndSubmit(1);
            assertBillingTermStepInActiveText('Semi-Annual - $48.00/6 mo');
        });
        it('should correctly present pay up front non-conventional term length', () => {
            cy.visit(`/subscription/cancel?accountNumber=10001086651&subscriptionId=10001085883`);
            selectCancelReasonAndSubmit();
            selectChangePlanOptionAndSubmit(1);
            selectBillingTermOptionAndSubmit(2);
            assertBillingTermStepInActiveText('5 Months for $39.99');
        });
        it('should correctly present pay per month (over 6 months)', () => {
            cy.visit(`/subscription/cancel?accountNumber=10001086651&subscriptionId=10001085883`);
            selectCancelReasonAndSubmit();
            selectChangePlanOptionAndSubmit(1);
            selectBillingTermOptionAndSubmit(3);
            assertBillingTermStepInActiveText('6 Months for $7.99/mo');
        });
        it('should correctly present pay per month (over 12 months)', () => {
            cy.visit(`/subscription/cancel?accountNumber=10001086651&subscriptionId=10001085883`);
            selectCancelReasonAndSubmit();
            selectChangePlanOptionAndSubmit(1);
            selectBillingTermOptionAndSubmit(4);
            assertBillingTermStepInActiveText('12 Months for $7.99/mo');
        });
    });
});
