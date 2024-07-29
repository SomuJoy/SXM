import { Before, Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountOemSuccess } from '../support/stubs/account';
import { stubAllPackageDescriptionsSuccess, stubOffersCustomerSelfPayPromoSuccess, stubOffersInfoSelfPayPromoSuccess } from '../support/stubs/offers';
import { stubQuotesQuoteSelfPayPromoSuccess } from '../support/stubs/quotes';
import { stubCardBinRangesSuccess, stubEnvInfoSuccess } from '../support/stubs/utility';

Before(() => {
    cy.viewport('ipad-2', 'landscape');
    stubEnvInfoSuccess();
    stubAllPackageDescriptionsSuccess();
    stubCardBinRangesSuccess();
});

// Scenario: Customer is presented a self pay promo offer
Given(/^a customer visits the purchase flow with valid device information$/, () => {
    stubAccountOemSuccess();
    stubOffersCustomerSelfPayPromoSuccess();
    stubOffersInfoSelfPayPromoSuccess();
    stubQuotesQuoteSelfPayPromoSuccess();
    cy.setCookie('SXM_D_A', '10000218077#X65100AY', { path: '/', domain: '.siriusxm.com' });
    cy.visit('/');
});
Then(/^they should be presented a self pay promo offer$/, () => {
    cy.get('[data-test="OfferDetailsCard"]').should('be.visible');
});
