import {
    mockRoutesFromHAR,
    getIsCanada,
    cyGetE2eMarketingPromoCodePromoCodeApply,
    cyGetE2eMarketingPromoCodePromoCodeInvalidText,
    cyGetE2eMarketingPromoCodePromoCodeTextField,
    cyGetE2eMarketingPromoCodePromoLabel
} from '@de-care/shared/e2e';

if (!getIsCanada()) {
    describe('Flepz promo codes in US', () => {
        const promoCode = 'CA-SXM-MUSIC333FOR6';

        beforeEach(() => {
            cy.server();

            cy.sxmMockIpConfig();
            cy.sxmMockAllPackageDesc();
            cy.sxmMockEnvInfo();
            cy.sxmMockCardBinRanges();

            mockRoutesFromHAR(require('../../fixtures/promo-codes/promo-code-us.har.json'));
        });

        describe('Promocode present in the URL', () => {
            it('should not show promo applied or any promo fields', () => {
                cy.visit(`/subscribe/checkout/flepz?promocode=${promoCode}`);

                cy.sxmWaitForSpinner();
                cy.sxmEnsureNoMissingTranslations();

                cyGetE2eMarketingPromoCodePromoCodeTextField().should('not.be.visible');
                cyGetE2eMarketingPromoCodePromoCodeApply().should('not.be.visible');
                cyGetE2eMarketingPromoCodePromoCodeInvalidText().should('not.be.visible');
                cyGetE2eMarketingPromoCodePromoLabel().should('not.be.visible');
            });
        });

        describe('No promocode in the URL', () => {
            it('should not show promo applied or any promo fields', () => {
                cy.visit(`/subscribe/checkout/flepz?promocode=${promoCode}`);

                cy.sxmWaitForSpinner();
                cy.sxmEnsureNoMissingTranslations();

                cyGetE2eMarketingPromoCodePromoCodeTextField().should('not.be.visible');
                cyGetE2eMarketingPromoCodePromoCodeApply().should('not.be.visible');
                cyGetE2eMarketingPromoCodePromoCodeInvalidText().should('not.be.visible');
                cyGetE2eMarketingPromoCodePromoLabel().should('not.be.visible');
            });
        });
    });
}
