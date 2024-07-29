import { mockResponseAllPackageDesc, mockResponseEnvInfo } from '@de-care/shared/e2e';

describe('Use Case - trial-activation', () => {
    beforeEach(() => {
        cy.server();
        cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/all-package-desc`, mockResponseAllPackageDesc);
        cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/utility/env-info`, mockResponseEnvInfo);

        cy.fixture('common/card-bin-ranges.json').as('cardBinRanges');
        cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/utility/card-bin-ranges`, '@cardBinRanges');
    });
    describe('Confirm router configurations', () => {
        it('should navigate to trial expired page', () => {
            cy.visit('/activate/trial/trial-expired-overlay');
            cy.get('trial-expired-overlay-component').should('exist');
        });
        it('should navigate to one step trial activation (NOUV)', () => {
            cy.fixture('use-cases/trial-activation/one-step-trial-activation-device-info.json').as('deviceInfo');
            cy.fixture('use-cases/trial-activation/one-step-trial-activation-offers.json').as('offers');
            cy.fixture('use-cases/trial-activation/one-step-trial-activation-customer-info.json').as('customerInfo');
            cy.fixture('use-cases/trial-activation/one-step-trial-activation-non-pii.json').as('nonPii');

            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/device/info`, '@deviceInfo');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/customer`, '@offers');
            cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/account/customer-info`, '@customerInfo');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/account/non-pii`, '@nonPii');

            cy.visit('/activate/trial?radioId=6901&usedCarBrandingType=SERVICE_LANE');
            cy.get('one-step-activation-flow').should('exist');
        });
        it('should navigate to two step trial activation (Google OOBIE)', () => {
            const prospectToken = '69ce7572-b2ed-432f-9ba6-3f73333b3f21';
            cy.fixture('use-cases/trial-activation/two-step-trial-activation-prospect-token.json').as('prospectToken');
            cy.fixture('use-cases/trial-activation/two-step-trial-activation-offers.json').as('offers');
            cy.fixture('use-cases/trial-activation/two-step-trial-activation-validate-customer-info.json').as('customerInfo');

            cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/trial/prospect-token/${prospectToken}`, '@prospectToken');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers`, '@offers');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/validate/customer-info`, '@customerInfo');

            cy.visit(`/activate/trial/flepz?prospecttkn=${prospectToken}&programCode=AA3MOTRIALGGLE`);
            cy.get('activation-flow').should('exist');
        });
        it('should navigate to service lane one click and confirmation page', () => {
            const token = '80a93356-4aaa-4d8f-8f48-b8c2c61b539b';
            cy.fixture('use-cases/trial-activation/service-lane-one-click.json').as('sloc');
            cy.fixture('use-cases/trial-activation/service-lane-one-click-confirmation-non-pii.json').as('nonPii');
            cy.fixture('security-questions.response.json').as('securityQuestions');

            cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/trial-activation/service-lane-one-click/${token}`, '@sloc');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/account/non-pii`, '@nonPii');
            cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/utility/security-questions`, '@securityQuestions');

            cy.visit('/subscribe/oneclick?cna_id=80a93356-4aaa-4d8f-8f48-b8c2c61b539b');
            // The SLOC route processes the request and if successful, redirects to confirmation page
            cy.get('service-lane-one-click-confirmation').should('exist');
        });

        describe('Service Lane 2 Click', () => {
            const token = '765915e5-0de6-4612-9b6c-713ceb0c7875';
            const corpId = 90005;
            beforeEach(() => {
                cy.fixture('sl2c-offers.response.json').as('offers');
                cy.fixture('sl2c-token.response.json').as('token');

                cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers`, '@offers');
                cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/trial/sltc-token/${token}`, '@token');
            });
            it('should navigate to service lane 2 click', () => {
                cy.visit(`activate/trial/service-lane?tkn=${token}&corpId=${corpId}`);
                cy.get('de-care-trial-activation-sl2c-main').should('exist');
                cy.contains('Available only on new pre-owned vehicle purchases').should('not.be.visible');
            });
            it('should navigate to service lane 2 click used vehicle', () => {
                cy.visit(`activate/trial/used-vehicle?tkn=${token}&corpId=${corpId}`);
                cy.get('de-care-trial-activation-sl2c-main').should('exist');
                cy.contains('Available only on new pre-owned vehicle purchases').should('be.visible');
            });
            it('should navigate to service lane 2 click confirmation page', () => {
                // Need to go through the whole flow of sl2c to confirm the route to the confirmation page
                //  (the confirmation page requires app state for the session, so to get a truthful test that the confirmation route works
                //   we need to execute the actual flow)
                cy.fixture('sl2c-submission.response.json').as('submission');
                cy.fixture('sl2c-non-pii.response.json').as('nonPii');
                cy.fixture('sl2c-customer-info-valid-address.response.json').as('addressCheck');

                cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/trial-activation/service-lane-two-click`, '@submission');
                cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/account/non-pii`, '@nonPii');
                cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/validate/customer-info`, '@addressCheck');

                cy.visit(`activate/trial/service-lane?tkn=${token}&corpId=${corpId}`);

                cy.get('[data-e2e="firstNameId"]').type('Paula');
                cy.get('[data-e2e="lastNameId"]').type('Myo');
                cy.get('[data-e2e="CCAddress"]').type('1525 Drury Lane');
                cy.get('[data-e2e="CCCity"]').type('New York');
                cy.get('[data-e2e="CCState"]')
                    .click()
                    .find('[data-e2e="sxmDropDownItem"]')
                    .first()
                    .click();
                cy.get('[data-e2e="CCZipCode"]').type('10002');
                cy.get('[data-e2e="ActivateTrialButton"').click({ force: true });

                cy.get('de-care-trial-activation-sl2c-confirmation').should('exist');
            });
        });
    });
});
