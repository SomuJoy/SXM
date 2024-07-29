import {
    cyGetE2eMarketingPromoCodePromoCodeAppliedText,
    cyGetE2eMarketingPromoCodePromoCodeApply,
    cyGetE2eMarketingPromoCodePromoCodeInvalidText,
    cyGetE2eMarketingPromoCodePromoCodeTextField,
    cyGetE2eMarketingPromoCodePromoLabel,
    cyGetE2eLeadOfferDetailsPromoCodeApplied,
    getIsCanada,
    cyGetHeroComponentHeading,
    createMockResponse,
} from '@de-care/shared/e2e';

if (getIsCanada()) {
    describe('Flepz promo codes in Canada', () => {
        const promoCode = 'CA-SXM-MUSIC333FOR6';

        beforeEach(() => {
            cy.server();

            cy.sxmMockIpConfig();
            cy.sxmMockAllPackageDesc();
            cy.sxmMockEnvInfo();
            cy.sxmMockCardBinRanges();

            createMockResponse({
                jsonPath: 'promo-codes/offers.response',
                alias: 'offers',
                endpoint: '/services/offers',
                verb: 'POST',
            });
        });

        describe('promocode present in the URL', () => {
            it('Valid promo code in URL', () => {
                createMockResponse({
                    jsonPath: 'promo-codes/validate-success.response',
                    alias: 'validate',
                    endpoint: '/services/offers/promocode/validate',
                    verb: 'POST',
                });

                cy.visit(`/subscribe/checkout/flepz?promocode=${promoCode}`);

                cy.sxmWaitForSpinner();
                cy.sxmEnsureNoMissingTranslations();

                cy.wait('@validate');

                cyGetE2eMarketingPromoCodePromoLabel().should((elem) => expect(elem.text()).to.contain('Remove promo code'));
                cyGetE2eMarketingPromoCodePromoCodeAppliedText().should((elem) => expect(elem.text()).to.contain(`Code ${promoCode} applied`));
                cyGetE2eMarketingPromoCodePromoCodeTextField().should('not.be.visible');
                cyGetE2eMarketingPromoCodePromoCodeApply().should('not.be.visible');
                cyGetE2eMarketingPromoCodePromoCodeInvalidText().should('not.be.visible');
            });

            it('Valid promo code in URL removed by user', () => {
                createMockResponse({
                    jsonPath: 'promo-codes/validate-success.response',
                    alias: 'validate',
                    endpoint: '/services/offers/promocode/validate',
                    verb: 'POST',
                });

                cy.visit(`/subscribe/checkout/flepz?promocode=${promoCode}`);

                cy.sxmWaitForSpinner();
                cy.sxmEnsureNoMissingTranslations();

                cy.wait('@validate');

                cyGetE2eMarketingPromoCodePromoLabel().first().click({ force: true });
                cyGetE2eMarketingPromoCodePromoLabel().first().click({ force: true });

                cyGetE2eMarketingPromoCodePromoCodeTextField().should('be.visible');
                cyGetE2eMarketingPromoCodePromoCodeApply().should('be.visible');
                cyGetE2eMarketingPromoCodePromoCodeInvalidText().should('not.be.visible');
            });

            it('Invalid promo code in URL should show dedicated page for offer not available', () => {
                cy.route({
                    method: 'POST',
                    url: `${Cypress.env('microservicesEndpoint')}/services/offers/promocode/validate`,
                    status: 400,
                    response: {
                        error: {},
                    },
                });

                cy.visit(`/subscribe/checkout/flepz?promocode=${promoCode}`);

                cy.sxmWaitForSpinner();
                cy.sxmCheckPageLocation('/subscribe/checkout/flepz');
                cy.sxmEnsureNoMissingTranslations();

                cyGetHeroComponentHeading().should((elem) => expect(elem.text()).to.contain('Sorry, this offer is not currently available'));
            });
        });

        describe('No promocode in the URL', () => {
            it('Valid promo code', () => {
                cy.visit(`/subscribe/checkout/flepz`);

                cy.sxmWaitForSpinner();
                cy.sxmEnsureNoMissingTranslations();

                createMockResponse({
                    jsonPath: 'promo-codes/validate-success.response',
                    alias: 'validate',
                    endpoint: '/services/offers/promocode/validate',
                    verb: 'POST',
                });

                cyGetE2eMarketingPromoCodePromoCodeTextField().first().type(promoCode, { force: true });
                cyGetE2eMarketingPromoCodePromoCodeApply().first().click({ force: true });

                cy.wait('@validate');

                cyGetE2eLeadOfferDetailsPromoCodeApplied().should((elem) => expect(elem.text()).to.contain(`Code '${promoCode}' applied`));

                cyGetE2eMarketingPromoCodePromoCodeAppliedText().should((elem) => expect(elem.text()).to.contain(`Code ${promoCode} applied`));
                cyGetE2eMarketingPromoCodePromoCodeInvalidText().should('not.be.visible');
            });

            it('Invalid promo code', () => {
                cy.visit(`/subscribe/checkout/flepz`);

                cy.sxmWaitForSpinner();
                cy.sxmEnsureNoMissingTranslations();

                cy.route({
                    method: 'POST',
                    url: `${Cypress.env('microservicesEndpoint')}/services/offers/promocode/validate`,
                    status: 400,
                    response: {
                        error: {},
                    },
                }).as('invalidValidate');

                cyGetE2eMarketingPromoCodePromoCodeTextField().first().type('WRONG CODE', { force: true });

                cyGetE2eMarketingPromoCodePromoCodeApply().first().click({ force: true });

                cy.wait('@invalidValidate');
                cy.wait('@offers');

                cyGetE2eMarketingPromoCodePromoCodeAppliedText().should('not.be.visible');
                cyGetE2eMarketingPromoCodePromoCodeInvalidText().should('be.visible');
                cyGetE2eMarketingPromoCodePromoCodeInvalidText().should((elem) => expect(elem.text()).to.contain('Invalid Promo code'));

                createMockResponse({
                    jsonPath: 'promo-codes/validate-success.response',
                    alias: 'validate',
                    endpoint: '/services/offers/promocode/validate',
                    verb: 'POST',
                });

                cyGetE2eMarketingPromoCodePromoCodeTextField().first().clear({ force: true });

                cyGetE2eMarketingPromoCodePromoLabel().first().click({ force: true });
                cyGetE2eMarketingPromoCodePromoCodeTextField().first().type(promoCode, { force: true });

                cyGetE2eMarketingPromoCodePromoCodeApply().first().click({ force: true });

                cy.wait('@validate');

                cyGetE2eMarketingPromoCodePromoCodeAppliedText().should((elem) => expect(elem.text()).to.contain(`Code ${promoCode} applied`));
                cyGetE2eMarketingPromoCodePromoCodeInvalidText().should('not.be.visible');
            });
        });
    });
}
