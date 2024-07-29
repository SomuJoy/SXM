import { mockResponseAllPackageDesc, mockResponseEnvInfo } from '@de-care/shared/e2e';

describe('Canadian Sirius custromer upsell', () => {
    beforeEach(() => {
        cy.server();
        cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/all-package-desc`, mockResponseAllPackageDesc);
        cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/utility/env-info`, mockResponseEnvInfo);
    });
    describe('Canadian Sirius positive tests', () => {
        it('Should hide the upsell in the modal and dispkay step 3 (upsell)', () => {
            cy.route(
                'POST',
                `${Cypress.env('microservicesEndpoint')}/services/device/validate`,
                'fixture:regression/ca-sirius-flepz-upsell/flepz-6603-device-validate-new.response'
            );
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/account/non-pii`, 'fixture:regression/ca-sirius-flepz-upsell/flepz-6603-non-pii-new.response');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/account/verify`, 'fixture:flepz-verify-new.response');
            cy.route(
                'POST',
                `${Cypress.env('microservicesEndpoint')}/services/offers/upsell`,
                'fixture:regression/ca-sirius-flepz-upsell/flepz-ca-sirius-upsell-upsell.response'
            );
            cy.route(
                'POST',
                `${Cypress.env('microservicesEndpoint')}/services/quotes/quote`,
                'fixture:regression/ca-sirius-flepz-upsell/flepz-ca-sirius-upsell-quote.response'
            );
            cy.route(
                'POST',
                `${Cypress.env('microservicesEndpoint')}/services/offers/customer`,
                'fixture:regression/ca-sirius-flepz-upsell/flepz-customer-ca-sirius-new.response'
            );

            cy.visit('/subscribe/checkout/flepz');

            cy.sxmWaitForSpinner();

            cy.sxmEnsureNoMissingTranslations();
        });
    });
});
