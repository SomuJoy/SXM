import {
    mockResponseAllPackageDesc,
    mockResponseEnvInfo,
    mockResponseFallbackOffer,
    mockResponse6for30SLITE,
    mockResponseFPSELECT,
    mockResponseFPALLACCESS,
    mockResponseLHUB6FOR89ESS,
    mockResponseMCP6FOR12LT,
    mockResponse6FOR30SELECT,
    cyGetOfferDescriptionFooter,
    cyGetOfferPromoPriceAndTerm
} from '@de-care/shared/e2e';

describe('Offer descriptions', () => {
    beforeEach(() => {
        cy.server();
        cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers/all-package-desc`, mockResponseAllPackageDesc);
        cy.route('GET', `${Cypress.env('microservicesEndpoint')}/services/utility/env-info`, mockResponseEnvInfo);
    });
    describe('flepz', () => {
        describe('Full-price', () => {
            it('Fallback offer', () => {
                cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers`, mockResponseFallbackOffer);
                cy.visit('/');

                cy.sxmWaitForSpinner();
                cyGetOfferPromoPriceAndTerm().should(elem => expect(elem.text()).to.equal('$16.99/mo'));
                cyGetOfferDescriptionFooter().should(elem =>
                    expect(elem.text()).to.equal('Get ad-free music, plus sports, news, talk, entertainment and more -- all in one place.')
                );
            });

            it('FPSELECT', () => {
                cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers`, mockResponseFPSELECT);
                cy.visit('/subscribe/checkout/flepz?programcode=FPSELECT');

                cy.sxmWaitForSpinner();
                cyGetOfferPromoPriceAndTerm().should(elem => expect(elem.text()).to.equal('$16.99/mo'));
                cyGetOfferDescriptionFooter().should(elem =>
                    expect(elem.text()).to.equal('Get ad-free music, plus sports, news, talk, entertainment and more -- all in one place.')
                );
            });

            it('FPALLACCESS', () => {
                cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers`, mockResponseFPALLACCESS);
                cy.visit('/subscribe/checkout/flepz?programcode=FPALLACCESS');

                cy.sxmWaitForSpinner();
                cyGetOfferPromoPriceAndTerm().should(elem => expect(elem.text()).to.equal('$21.99/mo'));
                cyGetOfferDescriptionFooter().should(elem =>
                    expect(elem.text()).to.equal(
                        'Get every channel available on your satellite radio, anywhere you drive. Plus, listen to SiriusXM or watch SiriusXM video online and on the app.'
                    )
                ); // bolded font?
            });
        });

        describe('Promo streaming', () => {
            it('LHUB6FOR89ESS', () => {
                cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers`, mockResponseLHUB6FOR89ESS);
                cy.visit('/subscribe/checkout/streaming?programcode=LHUB6FOR89ESS');

                cy.sxmWaitForSpinner();
                cyGetOfferPromoPriceAndTerm().should(elem => expect(elem.text()).to.equal('6 months for $89'));
                cyGetOfferDescriptionFooter().should(elem => expect(elem.text()).to.equal(''));
            });
        });

        describe('Promo MCP non-streaming', () => {
            it('MCP6FOR12LT', () => {
                cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers`, mockResponseMCP6FOR12LT);
                cy.visit('/subscribe/checkout/flepz?programcode=MCP6FOR12LT');

                cy.sxmWaitForSpinner();
                cyGetOfferPromoPriceAndTerm().should(elem => expect(elem.text()).to.equal('12 months for $5.99/mo'));
                cyGetOfferDescriptionFooter().should(elem =>
                    expect(elem.text()).to.equal(
                        'Don’t need every channel?  Only want to listen in your car? This is the package for you, for only $5.99 per month for 12 months. That is 64% off the regular monthly price of $16.99.'
                    )
                );
            });
        });

        describe('Promo non-streaming', () => {
            it('6for30SLITE', () => {
                cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers`, mockResponse6for30SLITE);
                cy.visit('/subscribe/checkout/flepz?programcode=6for30SLITE');

                cy.sxmWaitForSpinner();
                cyGetOfferPromoPriceAndTerm().should(elem => expect(elem.text()).to.equal('6 months for $4.99/mo'));
                cyGetOfferDescriptionFooter().should(elem =>
                    expect(elem.text()).to.equal(
                        'Don’t need every channel?  Only want to listen in your car? This is the package for you, for only $29.94  for 6 months. That is 70% off the regular monthly price of $16.99.'
                    )
                );
            });
            it('6FOR30SELECT', () => {
                cy.route('POST', `${Cypress.env('microservicesEndpoint')}/services/offers`, mockResponse6FOR30SELECT);
                cy.visit('/subscribe/checkout/flepz?programcode=6FOR30SELECT');

                cy.sxmWaitForSpinner();
                cyGetOfferPromoPriceAndTerm().should(elem => expect(elem.text()).to.equal('6 months for $4.99/mo'));
                cyGetOfferDescriptionFooter().should(elem =>
                    expect(elem.text()).to.equal(
                        'Listen & watch your favorites in all your favorite places—in your car, on your phone or at home for only $29.94  for 6 months. That is 70% off the regular monthly price of $16.99.'
                    )
                );
            });
        });
    });
});
