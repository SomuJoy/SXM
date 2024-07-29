import { mockResponseEnvInfo } from '@de-care/shared/e2e';

describe('Third-party billing', () => {
    beforeEach(() => {
        cy.server();
        cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/utility/env-info`, mockResponseEnvInfo);
    });

    describe('Landing page', () => {
        it('Already active should display the page', () => {
            cy.fixture('third-party-billing/entitlement-account-already-active.response').as('entitlement');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/identity/customer/entitlement`, '@entitlement').as('entitlementRoute');

            cy.visit('/subscribe/entitlement?entitlementId=1224');

            cy.sxmWaitForSpinner();

            cy.sxmCheckPageLocation('/subscribe/entitlement/already-active');
        });

        it('Non-active should display the form', () => {
            cy.fixture('third-party-billing/entitlement-account-not-active.response').as('entitlement');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/identity/customer/entitlement`, '@entitlement').as('entitlementRoute');

            cy.visit('/subscribe/entitlement?entitlementId=1224');

            cy.sxmWaitForSpinner();
        });

        it('Invalid Reseller Code', () => {
            cy.fixture('third-party-billing/entitlement-account-invalid-reseller-code-response').as('entitlement');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/identity/customer/entitlement`, '@entitlement').as('entitlementRoute');

            cy.visit('/subscribe/entitlement?entitlementId=1224');

            cy.sxmWaitForSpinner();
        });
    });
});
