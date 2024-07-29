import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountLoadAndOffersForRtd } from './common-utils/stubs';
import { visitCheckoutTargetedRtdWithAllowedProgramCode } from './common-utils/ui';
import { stubPurchaseChangeSubscriptionStreamingCommonSuccess } from '../../../../../support/stubs/de-microservices/purchase';
import {
    stubCheckEligibilityCaptchaNotRequiredSuccess,
    stubOffersCheckEligibilityStreamingStreamingCommonSuccess,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteStreamingNonAccordionTargetedEssentialStreamingMonthly } from '../../../../../support/stubs/de-microservices/quotes';
import { fillOutPaymentBasicInfoWithPhoneAndZipFormAndSubmit } from '../common-utils/ui';
import { stubPaymentInfoSuccess } from '../../common-utils/stubs';

Before(() => {
    cy.viewport('iphone-x');
    stubAccountLoadAndOffersForRtd();
});

When(/^a trial RTD customer visits the targeted streaming purchase experience, could see the offer page$/, () => {
    visitCheckoutTargetedRtdWithAllowedProgramCode();
    cy.get('sxm-ui-primary-package-card').should('be.visible');
});

Then(/^user should see setup your payment step after clicks on continue$/, () => {
    cy.get('[data-test="continueButton"]').click();
    cy.get('[data-test="bodyTitle"]').should('contain', "You won't be charged until your trial subscription");
    cy.get('step-targeted-payment-page').should('be.visible');
});

Then(/^user should see expected review page step after payment information is sent/, () => {
    let expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 6);
    const formattedExpirationDate = `${expirationDate.getMonth()}${expirationDate.getFullYear() % 100}`;
    cy.get('[data-test="sxmUINameOnCard"]').clear().type('cesar test');
    cy.get('[data-test="sxmUICreditCardNumber"]').clear().type('4111111111111111');
    cy.get('[data-test="creditCardFormFields.ccExpirationDate"]').clear({ force: true }).type(formattedExpirationDate);
    cy.get('[data-test="sxmUICvvFormField"]').clear({ force: true }).type('123');
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubOffersCheckEligibilityStreamingStreamingCommonSuccess();
    stubQuotesQuoteStreamingNonAccordionTargetedEssentialStreamingMonthly();
    stubPaymentInfoSuccess();
    fillOutPaymentBasicInfoWithPhoneAndZipFormAndSubmit();
});

Then(/^the user should be able to accept and submit the review$/, () => {
    stubPurchaseChangeSubscriptionStreamingCommonSuccess();
    cy.get('[data-test="chargeAgreementFormField"]').click({ force: true });
    cy.get('[data-test="ReviewQuoteAndApproveFormSubmitButton"]').click();
});
