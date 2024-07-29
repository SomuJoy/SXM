import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountLookupSuccess, stubCaptchaNotRequired, stubPaymentInfoSuccess } from '../../common-utils/stubs';
import { stubTransactionSuccess } from '../common-utils/stubs';
import {
    acceptAndSubmitTransaction,
    fillOutAccountLookupForm,
    fillOutAndSubmitPaymentInfoForm,
    submitAccountLookupForm,
    visitCheckoutOrganicAccordion,
} from '../common-utils/ui';
import { stubOffersCustomerSuccessDigitalPromo, stubOffersSuccessDigitalPromo } from '../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteStreamingAccordionOrganicSuccess } from '../../../../../support/stubs/de-microservices/quotes';

Before(() => {
    stubOffersSuccessDigitalPromo();
    cy.viewport('iphone-x');
});
When('a customer goes through the organic streaming purchase steps', () => {
    visitCheckoutOrganicAccordion();
    cy.primaryPackageCardIsVisibleAndContains('SiriusXM Streaming Music & Entertainment');
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
    stubTransactionSuccess();
    acceptAndSubmitTransaction();
});
Then('they should land on the confirmation page', () => {
    cy.url().should('contain', '/thanks');
});
