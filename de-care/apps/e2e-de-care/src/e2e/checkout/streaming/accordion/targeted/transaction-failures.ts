import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { getDigitalDataCustomerInfo } from '../../../../common-utils/digital-data';
import { stubCaptchaNotRequired, stubPaymentInfoSuccess } from '../../common-utils/stubs';
import { stubTransactionSuccess } from '../common-utils/stubs';
import { acceptAndSubmitTransaction, fillOutAndSubmitTargetedPaymentInfo, visitCheckoutTargetedAccordionWithToken } from '../common-utils/ui';
import { stubAccountTokenWithCardOnFile } from '../../../../../support/stubs/de-microservices/account';
import { stubTransactionInvalidCreditCard } from '../../../../../support/stubs/de-microservices/purchase';
import { stubOffersCustomerSuccessDigitalPromo } from '../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteStreamingAccordionOrganicSuccess } from '../../../../../support/stubs/de-microservices/quotes';
import { stubValidatePasswordSuccess } from '../../../../../support/stubs/de-microservices/validate';

Before(() => {
    cy.viewport('iphone-x');
});

When(/^a customer goes through the legacy targeted streaming purchase steps with a valid program code and a new transaction id and invalid credit card$/, () => {
    stubAccountTokenWithCardOnFile();
    stubOffersCustomerSuccessDigitalPromo();
    visitCheckoutTargetedAccordionWithToken();
    goThroughTargetedTransactionUpToReviewStep();
    stubTransactionInvalidCreditCard();
    getDigitalDataCustomerInfo().then((customerInfo) => {
        cy.wrap(customerInfo?.transactionId).as('firstTransactionId');
    });
    acceptAndSubmitTransaction();
});
Then(/^a new transaction id should be generated$/, () => {
    getDigitalDataCustomerInfo().then(function (customerInfo) {
        expect(customerInfo?.transactionId).to.not.equal(this.firstTransactionId);
    });
});
Then(/^they should be able to complete the transaction if they update to a valid credit card$/, () => {
    stubPaymentInfoSuccess();
    stubCaptchaNotRequired();
    stubQuotesQuoteStreamingAccordionOrganicSuccess();
    cy.get('[data-test="CCCardNumberTextfieldMasked"]').click();
    fillOutAndSubmitTargetedPaymentInfo();
    stubTransactionSuccess();
    cy.get('[data-test="reviewOrder.completeButton"]').click();
});
Then(/^they should land on the confirmation page$/, () => {
    cy.url().should('contain', '/thanks');
});

const goThroughTargetedTransactionUpToReviewStep = () => {
    stubValidatePasswordSuccess();
    stubPaymentInfoSuccess();
    stubCaptchaNotRequired();
    stubQuotesQuoteStreamingAccordionOrganicSuccess();
    fillOutAndSubmitTargetedPaymentInfo();
};
