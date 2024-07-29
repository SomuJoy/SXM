import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubCheckEligibilityCaptchaNotRequiredSuccess } from '../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteSatelliteTargetedSatellitePromoSelfPay } from '../../../../support/stubs/de-microservices/quotes';
import { stubPurchaseAddSubscriptionAddRadioRouterSuccess } from '../../../../support/stubs/de-microservices/purchase';
import { stubUtilitySecurityQuestionsSuccess } from '../../../../support/stubs/de-microservices/utility';
import { getRadioInfoAndOffers, gotoManageRoute } from './common-steps/steps';
import {
    stubAccountNonPii,
    stubAccountSuccess,
    stubDeviceInfoWithVehicle,
    stubFlepzRadioNoResults,
    stubFlepzRadioWithResults,
    stubOffersCustomerAddForAddRadio,
    stubOffersInfoSelfPayPromoSuccess,
} from './common-utils/stubs';
import { stubDeviceRefreshSuccess, stubDeviceValidateNewSuccess } from '../../../../support/stubs/de-microservices/device';
import { stubAccountNonPiiNoAccountWithMarketingId } from '../../../../support/stubs/de-microservices/account';

When(/^they choose to add a car and streaming subscription having no available radios$/, () => {
    stubFlepzRadioNoResults();
    cy.get('[data-test="carAndStreamingLinkButton"]').click({ force: true });
});

When(/^they continue with the first radio listed$/, () => {
    getRadioInfoAndOffers();
    cy.get('[data-test="SelectYourRadioFormOption"] input').first().click({ force: true });
    cy.get('[data-test="SelectYourRadioFormSubmit"]').click({ force: true });
});

Then(/^they should be presented with the pick your plan page$/, () => {
    cy.get('[data-test="PickAPlanPage"]').should('be.visible');
});

When(/^they select a plan and proceed to payment$/, () => {
    cy.get('[data-test="multiPackageSelectionForm"] input').first().click({ force: true });
    cy.get('[data-test="multiPackageSelectionFormSubmitButton"]').click({ force: true });
    cy.get('[data-test="PaymentIntContinueButton"]').click({ force: true });
});

Then(/^they will select and existing card and continue$/, () => {
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubQuotesQuoteSatelliteTargetedSatellitePromoSelfPay();
    stubUtilitySecurityQuestionsSuccess();
    cy.get('[data-test="PaymentInfoExistingCard"').click();
    cy.get('[data-test="PaymentConfirmationButton"]').click();
});

Then(/^they will click complete my order and go to confirmation page$/, () => {
    stubPurchaseAddSubscriptionAddRadioRouterSuccess();
    cy.get('[data-test="chargeAgreementFormField"]').click({ force: true });
    cy.get('[data-test="ReviewQuoteAndApproveFormSubmitButton"]').click();
});

Then('they should be able to send the refresh signal', () => {
    stubDeviceRefreshSuccess();
    cy.get('[data-e2e="sendRefreshSignalButton"]').click();
});

When(/^they enter a new radio they should be taken to the pick your plan page$/, () => {
    stubDeviceValidateNewSuccess();
    stubAccountNonPiiNoAccountWithMarketingId();
    stubDeviceInfoWithVehicle();
    stubOffersCustomerAddForAddRadio();
    stubOffersInfoSelfPayPromoSuccess();
    cy.get('[data-test="radioIdInput"]').type('990003359555');
    cy.get('[data-test="continueButton"]').click({ force: true });
});
