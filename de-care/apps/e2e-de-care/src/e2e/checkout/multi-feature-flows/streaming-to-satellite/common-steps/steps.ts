import { Then, Before, When } from '@badeball/cypress-cucumber-preprocessor';
// TODO: We need to decide if we want to elevate these up to a common shared location or allow multi-feature-flows coverage to reach into sibling stuff
import { stubAccountLookupSuccess, stubCaptchaNotRequired, stubPaymentInfoSuccess } from '../../../streaming/common-utils/stubs';
import { stubTransactionSuccess } from '../../../streaming/non-accordion/common-utils/stubs';
import {
    acceptAndSubmitTransaction,
    clickContinueOnCredentialsInterstitial,
    clickContinueOnOfferPresentment,
    clickContinueOnPaymentInterstitial,
    fillOutAndSubmitAccountLookupForm,
    fillOutAndSubmitPaymentInfoForm,
    visitCheckoutOrganicWithAllowedProgramCodeAndSatupcode,
} from '../../../streaming/non-accordion/common-utils/ui';
import { fillOutNewPaymentInfoAddress, fillOutNewPaymentInfoCreditCard } from '../common-utils/ui';
import {
    stubIdentityCustomerFlepzNoResults,
    stubIdentityCustomerFlepzThreeClosedRadiosWithOneNickname,
    stubIdentityCustomerFlepzTwoClosedRadios,
    stubIdentityCustomerFlepzTwoClosedRadiosNoVehicleInfo,
} from '../../../../../support/stubs/de-microservices/identity';
import {
    stubAllPackageDescriptionsSuccess,
    stubOffersCustomerSuccessDigitalRtpFree,
    stubOffersSuccessDigitalRtpFree,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteStreamingNonAccordionOrganicSuccess } from '../../../../../support/stubs/de-microservices/quotes';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import { stubUtilityCardBinRangesSuccess } from '../../../../../support/stubs/de-microservices/utility';
import { stubValidateCustomerInfoAddressAutoCorrectSuccess } from '../../../../../support/stubs/de-microservices/validate';

Before(() => {
    stubUtilityCardBinRangesSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
    stubAllPackageDescriptionsSuccess();
    stubOffersSuccessDigitalRtpFree();
});

When(/^a customer goes through the organic streaming purchase steps with a valid program code and valid satupcode$/, () => {
    visitCheckoutOrganicWithAllowedProgramCodeAndSatupcode();
    cy.wait('@offersInfo');
    clickContinueOnOfferPresentment();
    cy.wait(1000);
    clickContinueOnCredentialsInterstitial();
    stubAccountLookupSuccess();
    stubOffersCustomerSuccessDigitalRtpFree();
    fillOutAndSubmitAccountLookupForm();
    clickContinueOnPaymentInterstitial();
    //stubOfferAndSatelliteAddCardUpsell();
    stubPaymentInfoSuccess();
    stubCaptchaNotRequired();
    stubQuotesQuoteStreamingNonAccordionOrganicSuccess();
    fillOutAndSubmitPaymentInfoForm();
    stubTransactionSuccess();
    acceptAndSubmitTransaction();
});

Then(/^they click on the add car cta and do not have any existing closed devices$/, () => {
    stubIdentityCustomerFlepzNoResults();
    cy.get('[data-test="addCarSubscriptionButton"]').click();
});

Then(/^they click on the add car cta and existing closed devices are found$/, () => {
    stubIdentityCustomerFlepzTwoClosedRadios();
    cy.get('[data-test="addCarSubscriptionButton"]').click();
});

Then(/^they click on the add car cta and existing closed devices with no vehicleInfo are found$/, () => {
    stubIdentityCustomerFlepzTwoClosedRadiosNoVehicleInfo();
    cy.get('[data-test="addCarSubscriptionButton"]').click();
});

Then(/^they click on the add car cta and existing closed devices with nickname are found$/, () => {
    stubIdentityCustomerFlepzThreeClosedRadiosWithOneNickname();
    cy.get('[data-test="addCarSubscriptionButton"]').click();
});

Then(/^they should be presented with the payment page$/, () => {
    cy.get('[data-test="PaymentInfoUseCardNewAddressForm"]').should('be.visible');
});

Then(/^they should be able to complete the transaction using card on file$/, () => {
    stubValidateCustomerInfoAddressAutoCorrectSuccess();
    cy.get('[data-test="PaymentInfoExistingCard"] input').click({ force: true });
    fillOutNewPaymentInfoAddress();
    // TODO: stub the review step data calls
    cy.get('[data-test="PaymentConfirmationButton"]').click();
    // TODO: stub the transaction submission calls
    //       and complete the transaction
});

Then(/^they should be able to complete the transaction using a new card$/, () => {
    stubValidateCustomerInfoAddressAutoCorrectSuccess();
    cy.get('[data-test="PaymentInfoNewCard"] input').click({ force: true });
    fillOutNewPaymentInfoAddress();
    fillOutNewPaymentInfoCreditCard();
    // TODO: stub the review step data calls
    cy.get('[data-test="PaymentConfirmationButton"]').click();
    // TODO: stub the transaction submission calls
    //       and complete the transaction
});
