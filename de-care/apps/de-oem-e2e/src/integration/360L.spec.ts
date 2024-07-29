import { defaultAliasingFn, getAliasForURL, mockResponseAllPackageDesc, mockResponseEnvInfo, mockRoutesFromHAR } from '@de-care/shared/e2e';
import {
    cyGetE2eChargeAgreementCheckbox,
    cyGetE2eOemBillingAddressSubmit,
    cyGetE2eOemCCAddress,
    cyGetE2eOemCCCity,
    cyGetE2eOemCCState,
    cyGetE2eOemCCZipCode,
    cyGetE2eOemOfferStepSubmit,
    cyGetE2eOemPaymentFormCcExpirationMonth,
    cyGetE2eOemPaymentFormCcExpirationYear,
    cyGetE2eOemPaymentFormCcNumber,
    cyGetE2eOemPaymentFormName,
    cyGetE2eOemPaymentFormSubmit,
    cyGetE2eOemSummaryStepCompleteButton,
    cyGetE2eVerifyAddressRetainButton
} from '../support/360L.po';

describe('360L', () => {
    let mocksFromHAR: any;

    before(() => {
        cy.server();
        mocksFromHAR = mockRoutesFromHAR(require('../fixtures/360L-landing.har.json'), { aliasingFn: defaultAliasingFn, prefix: '**' });
    });

    beforeEach(() => {
        cy.route('POST', `**/services/offers/all-package-desc`, mockResponseAllPackageDesc);
        cy.route('GET', `**/services/utility/env-info`, mockResponseEnvInfo);

        cy.setCookie('SXM_D_A', '10000218077#X65100AY', { path: '/', domain: '.siriusxm.com' });
        cy.visit('/');
    });

    it('should complete the flow', () => {
        const customerInfoUrl = `**/services/validate/customer-info`;
        const customerInfoAlias = getAliasForURL('POST', '/services/validate/customer-info');

        cyGetE2eOemOfferStepSubmit().click({ force: true });

        cyGetE2eOemPaymentFormName().type('Paula Myo', { force: true });
        cyGetE2eOemPaymentFormCcNumber().type('4111111111111111', { force: true });
        cyGetE2eOemPaymentFormCcExpirationMonth().type('03', { force: true });
        cyGetE2eOemPaymentFormCcExpirationYear().type('2027', { force: true });

        cyGetE2eOemPaymentFormSubmit().click({ force: true });
        cy.wait(`@${customerInfoAlias}`);

        const billingResponse = mocksFromHAR[customerInfoAlias][1].response.content.text;

        cy.route('POST', customerInfoUrl, billingResponse).as(customerInfoAlias);
        cyGetE2eOemCCAddress().type('1221 6th Ave', { force: true });
        cyGetE2eOemCCCity().type('New York', { force: true });
        cyGetE2eOemCCState().type('NY', { force: true });
        cyGetE2eOemCCZipCode().type('10020', { force: true });

        cyGetE2eOemBillingAddressSubmit().click({ force: true });
        cy.wait(`@${customerInfoAlias}`);

        cyGetE2eVerifyAddressRetainButton().click({ force: true });
        cyGetE2eChargeAgreementCheckbox().check({ force: true }); // being covered by label

        cyGetE2eOemSummaryStepCompleteButton().click({ force: true });
    });
});
