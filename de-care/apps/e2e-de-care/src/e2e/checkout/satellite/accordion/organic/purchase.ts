import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { fillOutFlepzForm, fillOutNewBillingInfo, submitNewBillingInfoForm } from '../common-utils/ui';
import {
    stubAccountNonPiiNoAccountWithMarketingId,
    stubAccountNonPiiSatelliteOrganic400DeviceNotInUse,
    stubAccountNonPiiSatelliteOrganicAccountWithClosedRadio,
    stubAccountNonPiiSatelliteOrganicNewAccountCreated,
    stubAccountNonPiiSatelliteOrganicWithTrialSubscription,
    stubAccountVerifySuccess,
} from '../../../../../support/stubs/de-microservices/account';
import {
    stubCheckEligibilityCaptchaNotRequiredSuccess,
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell,
    stubOffersSuccessSatellitePromoSelfPay,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteSatelliteOrganicPromoSelfPay } from '../../../../../support/stubs/de-microservices/quotes';
import { stubIdentityCustomerFlepzActiveAccountWithClosedSubscription, stubIdentityDeviceLicensePlateFound } from '../../../../../support/stubs/de-microservices/identity';
import {
    stubPurchaseAddSubscriptionStreamingCommonSuccess,
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration,
    stubPurchaseNewAccountSatelliteOrganicEligibleForRegistration,
} from '../../../../../support/stubs/de-microservices/purchase';
import {
    stubDeviceInfoNewNotInUseWithVehicleAndVin,
    stubDeviceInfoNewWithVehicleSuccess,
    stubDeviceValidateNewSuccess,
    stubDeviceValidateUsedSuccess,
} from '../../../../../support/stubs/de-microservices/device';
import { stubUtilitySecurityQuestionsSuccess } from '../../../../../support/stubs/de-microservices/utility';
import { stubValidateCustomerInfoAddressAutoCorrectSuccess, stubValidateUniqueLoginSuccess } from '../../../../../support/stubs/de-microservices/validate';

Before(() => {
    stubOffersSuccessSatellitePromoSelfPay();
    cy.viewport('iphone-x');
});
// Common
When(/^a customer visits the page with the program code 6FOR30SELECT$/, () => {
    cy.visit(`/subscribe/checkout/flepz?programcode=6FOR30SELECT`);
});
Then(/^they should land on the confirmation page$/, () => {
    cy.url().should('contain', '/thanks');
});

// Scenario: Experience loads correct offer for 6FOR30SELECT
Then(/^they should be presented with the correct offer$/, () => {
    cy.primaryPackageCardIsVisibleAndContains('SiriusXM Music & Entertainment');
});

// Scenario: Can complete checkout using existing radio id
When(/^they go through the organic satellite purchase steps using an existing radio id$/, () => {
    // Look up device by radio id
    stubDeviceValidateUsedSuccess();
    stubAccountNonPiiSatelliteOrganicWithTrialSubscription();
    cy.get('[data-test="CarInfoRadioIDRadioButton"]').first().click({ force: true });
    cy.get('[data-test="radioLookupOptions.carInfoContinueButton"]').first().click();
    cy.get('[data-test="lookupRadioId.input"]').clear().type('GC21000K');
    cy.get('[data-test="lookupRadioId.button"]').click();
    // Do LPZ
    stubAccountVerifySuccess();
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell();
    cy.get('[data-test="validateLastNameInput"]').clear().type('Smith');
    cy.get('[data-test="validatePhoneInput"]').clear().type('2122222222');
    cy.get('[data-test="validateZipInput"]').clear().type('12345');
    cy.get('[data-test="validateSubmissionButton"]').click();
    // Billing info
    cy.get('[data-test="PaymentInfoExistingCard"').click();
    stubQuotesQuoteSatelliteOrganicPromoSelfPay();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration();
    stubUtilitySecurityQuestionsSuccess();
    cy.get('[data-test="PaymentConfirmationButton"]').click();
    // Review
    cy.get('[data-test="ChargeMyCardText"]').click();
    cy.get('[data-test="reviewOrder.completeButton"]').click();
});

// Scenario: Can complete checkout using a closed radio id
When(/^they go through the organic satellite purchase steps using a closed radio id$/, () => {
    // Look up device by closed radio id
    stubDeviceValidateNewSuccess();
    stubAccountNonPiiSatelliteOrganic400DeviceNotInUse();
    stubDeviceInfoNewWithVehicleSuccess();
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell();
    cy.get('[data-test="CarInfoRadioIDRadioButton"]').first().click({ force: true });
    cy.get('[data-test="radioLookupOptions.carInfoContinueButton"]').first().click();
    cy.get('[data-test="lookupRadioId.input"]').clear().type('GC21000K');
    cy.get('[data-test="lookupRadioId.button"]').click();
    // Billing info new account
    stubValidateCustomerInfoAddressAutoCorrectSuccess();
    fillOutNewBillingInfo();
    stubQuotesQuoteSatelliteOrganicPromoSelfPay();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseNewAccountSatelliteOrganicEligibleForRegistration();
    stubAccountNonPiiSatelliteOrganicNewAccountCreated();
    stubUtilitySecurityQuestionsSuccess();
    submitNewBillingInfoForm();
    // Review
    cy.get('[data-test="ChargeMyCardText"]').click();
    cy.get('[data-test="reviewOrder.completeButton"]').click();
});

//Scenario: Can complete checkout using flepz data
When(/^they go through the organic satellite purchase steps using FLEPZ data for an account without an existing self paid subscription$/, () => {
    // 1. Select Account Info Tab and Enter Info
    cy.get('[data-test="FlepzYourInfoLink"]').first().click({ force: true });
    fillOutFlepzForm();

    // 2. Stub response for lookup triggered by continue button and click
    stubIdentityCustomerFlepzActiveAccountWithClosedSubscription();
    // triggers stubbed request POST /identity/customer/flepz to lookup account
    cy.get('[data-test="flepzForm.continueButton"]').first().click({ force: true });

    // 3. Modal presented, stub required responses and click continue
    stubAccountNonPiiSatelliteOrganicAccountWithClosedRadio(); // Continue requires /account/non-pii stub
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell(); // Continue requires promo code stubs
    cy.get('[data-test="yourInfo.continueButton"]').first().click({ force: true });

    // 4. Modal dismissed and payment page shown, select pay with existing card, stub required responses for confirmation, click confirm
    cy.get('[data-test="PaymentInfoExistingCard"').click();
    stubQuotesQuoteSatelliteOrganicPromoSelfPay();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    cy.get('[data-test="PaymentConfirmationButton"]').first().click({ force: true });

    // 5. Review order page shown, click cc confirm checkbox, stub required http requests for complete, click complete
    stubValidateUniqueLoginSuccess();
    stubUtilitySecurityQuestionsSuccess();
    stubPurchaseAddSubscriptionStreamingCommonSuccess();
    cy.get('[data-test="ChargeMyCardText"]').click();
    cy.get('[data-test="reviewOrder.completeButton"]').click();
});

//Scenario: Can complete checkout using VIN lookup
When(/^they go through the organic satellite purchase steps using VIN data for a closed radio$/, () => {
    // 1. Select VIN lookup radio button, click continue
    stubDeviceValidateNewSuccess();
    stubAccountNonPiiNoAccountWithMarketingId();
    stubDeviceInfoNewWithVehicleSuccess();
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell();
    cy.get('[data-test="CarInfoVINRadioButton"]').first().click({ force: true });
    cy.get('[data-test="radioLookupOptions.carInfoContinueButton"]').first().click();

    // 2. Modal presented, enter VIN and click continue
    cy.get('[data-test="LookUpVINTextField"]').clear().type('XVMOYVSGV8CBAI3OM');
    cy.get('[data-test="identification.lookupVinComponent.CONTINUE"]').first().click({ force: true });

    // 3. Closed radio found for vehicle, new billing info form presented and filled out
    stubValidateCustomerInfoAddressAutoCorrectSuccess();
    fillOutNewBillingInfo();
    stubQuotesQuoteSatelliteOrganicPromoSelfPay();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseNewAccountSatelliteOrganicEligibleForRegistration();
    stubAccountNonPiiSatelliteOrganicNewAccountCreated();
    stubUtilitySecurityQuestionsSuccess();
    submitNewBillingInfoForm();

    // 4. Review order and complete
    cy.get('[data-test="ChargeMyCardText"]').click();
    cy.get('[data-test="reviewOrder.completeButton"]').click();
});

//Scenario: Can complete checkout using license plate lookup
When(/^they go through the organic satellite purchase steps using license plate data for a closed radio$/, () => {
    // 1. Select License plate lookup look up radio button, click continue
    cy.get('[data-test="CarInfoLicensePlateRadioButton"]').first().click({ force: true });
    cy.get('[data-test="radioLookupOptions.carInfoContinueButton"]').first().click();

    // 2. Modal presented, enter license plate number, state, and agreement checkbox, stub required API responses, and click continue
    stubIdentityDeviceLicensePlateFound();
    stubDeviceValidateNewSuccess();
    stubAccountNonPiiNoAccountWithMarketingId();
    stubDeviceInfoNewNotInUseWithVehicleAndVin();
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell();

    cy.get('[data-test="LookUpLicensePlateNumberTextField"]').clear().type('GES335');
    cy.selectValueInDropdown('[data-test="LicensePlateStateDropdown"]', 'FL');
    cy.get('[data-test="VinLookUpByLicenseAgreementCheckbox"]').first().click({ force: true });
    cy.get('[data-test="SubmitLicensePlateLookupButton"]').first().click({ force: true });

    // 3. Closed radio found for vehicle, new billing info form presented and filled out
    stubValidateCustomerInfoAddressAutoCorrectSuccess();
    fillOutNewBillingInfo();
    stubQuotesQuoteSatelliteOrganicPromoSelfPay();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseNewAccountSatelliteOrganicEligibleForRegistration();
    stubAccountNonPiiSatelliteOrganicNewAccountCreated();
    stubUtilitySecurityQuestionsSuccess();
    submitNewBillingInfoForm();

    // 4. Review order and complete
    cy.get('[data-test="ChargeMyCardText"]').click();
    cy.get('[data-test="reviewOrder.completeButton"]').click();
});
