import { Before, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountCustomerInfoSuccess } from '../../../../support/stubs/de-microservices/account';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../support/stubs/de-microservices/apigateway';
import {
    stubAllPackageDescriptionsSuccess,
    stubOffersCustomerSuccessStreamingOrganicTrialRtd,
    stubOffersSuccessStreamingOrganicTrialRtd,
} from '../../../../support/stubs/de-microservices/offers';
import { stubUtilityEnvInfoSuccess } from '../../../../support/stubs/de-microservices/utility';
import { primaryPackageCardIsVisibleAndContains } from '../../../../support/ui-common/package-cards';
import {
    rtdTrialActivationNewAccountSuccess,
    rtdTrialActivationNonPiiSuccess,
    stubAccountLookupSuccess,
    stubValidateCustomerInfoServiceAddressSuccess,
} from '../common-utils/stubs';
import { clickContinueOnOfferPresentment, fillOutAndSubmitAccountInfoForm, fillOutAndSubmitAccountLookupForm } from '../non-accordion/common-utils/ui';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Experience loads offer correctly for program code
When(/^a customer visits the streaming trial activation roll to drop experience with a valid program code$/, () => {
    stubUtilityEnvInfoSuccess();
    stubAllPackageDescriptionsSuccess();
    stubAccountCustomerInfoSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
    stubOffersSuccessStreamingOrganicTrialRtd();
    cy.visit(`/subscribe/checkout/trial/streaming?programcode=USTPSRTD2MOFREE`);
});
Then(/^they should be presented with the correct offer$/, () => {
    primaryPackageCardIsVisibleAndContains('SiriusXM Streaming Platinum');
    clickContinueOnOfferPresentment();
});

Then(/^they will see credentials step$/, () => {
    cy.get('de-care-step-organic-credentials-page').should('be.visible');
    stubAccountLookupSuccess();
    stubOffersCustomerSuccessStreamingOrganicTrialRtd();
    fillOutAndSubmitAccountLookupForm();
    cy.get('de-care-step-organic-account-info-interstitial-page').should('be.visible');
    cy.get('[data-test="continueButton"]').click();
});

Then(/^they will see account info form step$/, () => {
    cy.get('de-care-step-organic-account-info-setup-page').should('be.visible');
    stubValidateCustomerInfoServiceAddressSuccess();
    rtdTrialActivationNewAccountSuccess();
    rtdTrialActivationNonPiiSuccess();
    fillOutAndSubmitAccountInfoForm();
});

Then(/^they should see the follow on option page$/, () => {
    cy.get('de-care-step-organic-follow-on-option-page').should('be.visible');
});

When(/^a customer visits the streaming trial activation roll to drop experience with a valid program code and skip renewal param$/, () => {
    stubUtilityEnvInfoSuccess();
    stubAllPackageDescriptionsSuccess();
    stubAccountCustomerInfoSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
    stubOffersSuccessStreamingOrganicTrialRtd();
    cy.visit(`/subscribe/checkout/trial/streaming?programcode=USTPSRTD2MOFREE&skiprenewal=true`);
});

Then(/^they should see the confirmation page$/, () => {
    cy.get('de-care-step-organic-confirmation-page').should('be.visible');
});

Then(/^they could select to add a follow on and continue$/, () => {
    cy.get('de-care-step-organic-follow-on-option-page').should('be.visible');
    cy.get('[data-test="addFollowon"]').click();
    cy.get('[data-test="submitFollowOnOption"]').click();
});

Then(/^user could enter payment information$/, () => {
    cy.get('de-care-step-organic-setup-payment-page').should('be.visible');
    //todo fill out payment info and purchase the follow on
});
