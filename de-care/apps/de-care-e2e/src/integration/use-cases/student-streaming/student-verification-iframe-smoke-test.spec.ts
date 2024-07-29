import { mockResponseAllPackageDesc, mockResponseEnvInfo, mockResponseUSTSTUDENTPSRTP6MO1, sxmCheckPageLocation } from '@de-care/shared/e2e';

describe('Student Streaming', () => {
    beforeEach(() => {
        cy.server();
        cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/all-package-desc`, mockResponseAllPackageDesc);
        cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/utility/env-info`, mockResponseEnvInfo);
    });
    describe('landing page', () => {
        it('Successful IP lookup', () => {
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers`, mockResponseUSTSTUDENTPSRTP6MO1);

            cy.fixture('student-streaming-ip2location-default.response').as('ip2location');
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/utility/ip2location`, '@ip2location');

            cy.visit('/subscribe/checkout/studentverification?langPref=en&programCode=STUDENTPS12MO');

            cy.sxmWaitForSpinner();

            sxmCheckPageLocation('/subscribe/checkout/studentverification');
        });

        it('Unsuccessful IP Lookup', () => {
            cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers`, mockResponseUSTSTUDENTPSRTP6MO1);

            cy.route({
                method: 'POST',
                url: `${Cypress.env('microservicesEndpoint')}/services/utility/ip2location`,
                status: 500,
                response: {
                    error: {}
                }
            });

            cy.visit('/subscribe/checkout/studentverification?langPref=en&programCode=STUDENTPS12MO');

            cy.sxmWaitForSpinner();

            sxmCheckPageLocation('/subscribe/checkout/studentverification');
        });
    });
});
