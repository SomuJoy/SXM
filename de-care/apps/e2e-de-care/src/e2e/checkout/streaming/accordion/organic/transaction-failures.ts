import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { getDigitalDataCustomerInfo } from '../../../../common-utils/digital-data';
import { stubAccountLookupSuccess, stubCaptchaNotRequired, stubPaymentInfoSuccess } from '../../common-utils/stubs';
import { stubTransactionSuccess } from '../common-utils/stubs';
import {
    acceptAndSubmitTransaction,
    fillOutAccountLookupForm,
    fillOutAndSubmitPaymentInfoForm,
    submitAccountLookupForm,
    visitCheckoutOrganicAccordion,
} from '../common-utils/ui';
import { stubTransactionInvalidCreditCard } from '../../../../../support/stubs/de-microservices/purchase';
import { stubOffersCustomerSuccessDigitalPromo, stubOffersSuccessDigitalPromo } from '../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteStreamingAccordionOrganicSuccess } from '../../../../../support/stubs/de-microservices/quotes';

Before(() => {
    stubOffersSuccessDigitalPromo();
    cy.viewport('iphone-x');
});

// Scenario: Customer should get a new transaction id on credit card error
When(/^a customer goes through the legacy organic streaming purchase steps with a valid program code and a new transaction id and invalid credit card$/, () => {
    visitCheckoutOrganicAccordion();
    goThroughOrganicTransactionUpToReviewStep();
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
    fillOutAndSubmitPaymentInfoForm();
    stubTransactionSuccess();
    cy.get('[data-e2e="reviewOrder.completeButton"]').click();
});
Then(/^they should land on the confirmation page$/, () => {
    cy.url().should('contain', '/thanks');
});

const goThroughOrganicTransactionUpToReviewStep = () => {
    stubAccountLookupSuccess();
    stubOffersCustomerSuccessDigitalPromo();
    fillOutAccountLookupForm();
    submitAccountLookupForm();
    // ISSUE: we have to double click the submit button because of a UI issue
    cy.wait(500).then(() => {
        submitAccountLookupForm();
    });
    stubPaymentInfoSuccess();
    stubCaptchaNotRequired();
    stubQuotesQuoteStreamingAccordionOrganicSuccess();
    fillOutAndSubmitPaymentInfoForm();
};
