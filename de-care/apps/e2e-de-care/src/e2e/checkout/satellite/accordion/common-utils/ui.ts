import {
    stubAccountNonPiiSatelliteAccordionOrganicTrialWithSiriusPlatform,
    stubAccountNonPiiSatelliteAccordionOrganicWithTrialAndNoCardOnFile,
    stubAccountNonPiiSatelliteOrganic400DeviceNotInUse,
    stubAccountNonPiiSatelliteOrganicWithTrialSubscription,
    stubAccountNonPiiSatelliteTargetedWithTrialSubscription,
    stubAccountVerifySuccess,
} from '../../../../../support/stubs/de-microservices/account';
import {
    stubCheckEligibilityCaptchaNotRequiredSuccess,
    stubOffersCustomerSatelliteOrganicDefaultSelfPayOffersCustomerSuccess,
    stubOffersCustomerSatelliteOrganicWithSiriusAllAccessSuccess,
    stubOffersCustomerSatelliteOrganicWithSiriusPlatformChange,
    stubOffersCustomerSatelliteTargetedSelfPayPromoOffer,
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell,
    stubOffersInfoSatelliteAccordionOrganicSiriusMusicAndEntertainment,
    stubOffersNoPromoSuccess,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteSatelliteOrganicChangePlatformSuccess, stubQuotesQuoteSatelliteOrganicPromoSelfPay } from '../../../../../support/stubs/de-microservices/quotes';
import { stubDeviceInfoNewWithVehicleSuccess, stubDeviceValidateNewSuccess, stubDeviceValidateUsedSuccess } from '../../../../../support/stubs/de-microservices/device';
import {
    stubIdentityCustomerFlepzSatelliteOrganicWithSiriusAllAccessSuccess,
    stubIdentityDeviceLicensePlateSatelliteOrganicWithSiriusAllAccessSuccess,
} from '../../../../../support/stubs/de-microservices/identity';
import { stubPurchaseChangeSubscription } from '../../../../../support/stubs/de-microservices/purchase';
import { stubUtilitySecurityQuestionsSuccess } from '../../../../../support/stubs/de-microservices/utility';
import { stubValidateCustomerInfoNewCC } from '../../../../../support/stubs/de-microservices/validate';

export const visitFlepz = () => {
    cy.visit('/subscribe/checkout/flepz');
};

export const visitLegacyCheckoutWithTrialCustomer = () => {
    cy.visit('/subscribe/checkout?radioid=08U000HB&act=8110');
};

export const fillOutNewBillingInfo = () => {
    cy.get('[data-test="purchase.paymentInfoComponent"] [data-test="FlepzFirstNameTextfield"]').clear().type('Test');
    cy.get('[data-test="purchase.paymentInfoComponent"] [data-test="FlepzLastNameTextfield"]').clear().type('Person');
    cy.get('[data-test="purchase.paymentInfoComponent"] [data-test="FlepzEmailTextfield"]').clear().type('testemail@siriusxm.com');
    cy.get('[data-test="purchase.paymentInfoComponent"] [data-test="FlepzPhoneNumberTextfield"]').clear({ force: true }).type('5555555555', { force: true });
    cy.get('[data-test="billingAddressFormFields"] [data-test="CCAddress"]').clear({ force: true }).type('1234 Home Street', { force: true });
    cy.get('[data-test="billingAddressFormFields"] [data-test="CCCity"]').clear({ force: true }).type('Anytown', { force: true });
    cy.get('[data-test="billingAddressFormFields"] [data-test="CCState"]').contains('CA').click({ force: true });
    cy.get('[data-test="billingAddressFormFields"] [data-test="CCZipCode"]').clear({ force: true }).type('12345', { force: true });
    cy.get('[data-test="CCCardNumberTextfield"]').clear().type('4111111111111111');
    cy.get('[data-test="ccExpDateOnCardTextfield"]').clear({ force: true }).type('0235', { force: true });
    cy.get('[data-test="ccCVV"]').clear().type('123');
};
export const submitNewBillingInfoForm = () => {
    cy.get('[data-test="PaymentConfirmationButton"]').click();
};
export const fillOutAddNewCardBillingInfo = () => {
    cy.get('[data-test="billingAddressFormFields"] [data-test="CCAddress"]').clear({ force: true }).type('1 River Rd', { force: true });
    cy.get('[data-test="billingAddressFormFields"] [data-test="CCCity"]').clear({ force: true }).type('Schenectady', { force: true });
    cy.get('[data-test="billingAddressFormFields"] [data-test="CCState"]').contains('NY').click({ force: true });
    cy.get('[data-test="billingAddressFormFields"] [data-test="CCZipCode"]').clear({ force: true }).type('12345', { force: true });
    cy.get('[data-test="CCNameOnCardTextfield"]').clear().type('TEST NAME');
    cy.get('[data-test="CCCardNumberTextfield"]').clear().type('4111111111111111');
    cy.get('[data-test="ccExpDateOnCardTextfield"]').clear({ force: true }).type('0225', { force: true });
    cy.get('[data-test="ccCVV"]').clear().type('121');
};

export const fillOutFlepzForm = () => {
    cy.get('[data-test="FlepzFirstNameTextfield"]').clear().type('Test');
    cy.get('[data-test="FlepzLastNameTextfield"]').clear().type('Person');
    cy.get('[data-test="FlepzEmailTextfield"]').clear().type('testemail@siriusxm.com');
    cy.get('[data-test="FlepzPhoneNumberTextfield"]').clear({ force: true }).type('5555555555', { force: true });
    cy.get('[data-test="FlepzZipCodeTextfield"]').clear({ force: true }).type('12345', { force: true });
};
export const submitFlepzForm = () => {
    cy.get('[data-test="flepzForm.continueButton"]').click();
};

export const enterAndSubmitRadioIdLookup = () => {
    cy.get('[data-test="CarInfoRadioIDRadioButton"]').first().click({ force: true });
    cy.get('[data-test="radioLookupOptions.carInfoContinueButton"]').first().click();
    cy.get('[data-test="lookupRadioId.input"]').clear().type('GC21000K');
    cy.get('[data-test="lookupRadioId.button"]').click();
};
export const enterAndSubmitLPZ = () => {
    cy.get('[data-test="validateLastNameInput"]').clear().type('Smith');
    cy.get('[data-test="validatePhoneInput"]').clear().type('2122222222');
    cy.get('[data-test="validateZipInput"]').clear().type('12345');
    cy.get('[data-test="validateSubmissionButton"]').click();
};

export const selectExistingCcAndContinue = () => {
    cy.get('[data-test="PaymentInfoExistingCard"]').first().click({ force: true });
    cy.get('[data-test="PaymentConfirmationButton"]').first().click({ force: true });
};

export const agreeAndSubmitReview = () => {
    cy.get('[data-test="ChargeMyCardText"]').click();
    cy.get('[data-test="reviewOrder.completeButton"]').click();
};

export const stubDeviceValidateAndAccountVerifySuccess = () => {
    stubDeviceValidateUsedSuccess();
    stubAccountVerifySuccess();
};

export const stubQuotesSatelliteOrganicPromoSelfPayAndCaptchaNotRequired = () => {
    stubQuotesQuoteSatelliteOrganicPromoSelfPay();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
};

export const goThroughOrganicStepsUpToReviewStepForClosedRadio = () => {
    stubDeviceValidateNewSuccess();
    stubDeviceInfoNewWithVehicleSuccess();
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell();
    stubAccountNonPiiSatelliteOrganic400DeviceNotInUse();
    enterAndSubmitRadioIdLookup();
    stubQuotesSatelliteOrganicPromoSelfPayAndCaptchaNotRequired();
    cy.intercept('POST', '**/services/validate/customer-info', { fixture: 'de-microservices/validate/customer-info/satellite-organic_payment-success.json' });
    fillOutNewBillingInfo();
    submitNewBillingInfoForm();
};
export const goThroughTargetedStepsUpToReviewStepForClosedRadio = () => {
    stubQuotesSatelliteOrganicPromoSelfPayAndCaptchaNotRequired();
    cy.intercept('POST', '**/services/validate/customer-info', { fixture: 'de-microservices/validate/customer-info/satellite-organic_payment-success.json' });
    cy.get('[data-test="PaymentInfoNewCard"]').click();
    fillOutAddNewCardBillingInfo();
    submitNewBillingInfoForm();
};

export const enterAndSubmitRadioId = () => {
    cy.get('[data-test="radioLookupOptions.carInfoContinueButton"]').first().click();
    cy.get('[data-test="lookupRadioId.input"]').clear().type('GC21000K');
    cy.get('[data-test="lookupRadioId.button"]').click();
};

export const verifyRadioIdAndLpzOnSiriusPlatform = () => {
    stubDeviceValidateAndAccountVerifySuccess();
    stubAccountNonPiiSatelliteAccordionOrganicTrialWithSiriusPlatform();
    stubOffersCustomerSatelliteOrganicWithSiriusAllAccessSuccess();
    enterAndSubmitRadioId();
    enterAndSubmitLPZ();
};

export const enterAndSubmitVin = () => {
    cy.get('[data-test="CarInfoVINRadioButton').first().click({ force: true });
    cy.get('[data-test="radioLookupOptions.carInfoContinueButton"]').first().click();
    cy.get('[data-test="LookUpVINTextField"]').clear().type('88WCBAXQGJIOSF2UY');
    cy.get('[data-test="identification.lookupVinComponent.CONTINUE"]').click();
};

export const enterAndSubmitLicensePlateLookup = () => {
    cy.get('[data-test="CarInfoLicensePlateRadioButton"]').first().click({ force: true });
    cy.get('[data-test="radioLookupOptions.carInfoContinueButton"]').first().click();
    cy.get('[data-test="LookUpLicensePlateNumberTextField"]').clear().type('GES335');
    cy.selectValueInDropdown('[data-test="LicensePlateStateDropdown"]', 'FL');
    cy.get('[data-test="VinLookUpByLicenseAgreementCheckbox"]').first().click({ force: true });
    cy.get('[data-test="SubmitLicensePlateLookupButton"]').first().click({ force: true });
};

export const verifyVinAndLpzOnSiriusPlatform = () => {
    stubDeviceValidateAndAccountVerifySuccess();
    stubAccountNonPiiSatelliteAccordionOrganicTrialWithSiriusPlatform();
    stubOffersCustomerSatelliteOrganicWithSiriusAllAccessSuccess();
    enterAndSubmitVin();
    enterAndSubmitLPZ();
};

export const verifyFlepzOnSiriusPlatform = () => {
    stubDeviceValidateAndAccountVerifySuccess();
    stubAccountNonPiiSatelliteAccordionOrganicTrialWithSiriusPlatform();
    stubOffersCustomerSatelliteOrganicWithSiriusAllAccessSuccess();
    stubIdentityCustomerFlepzSatelliteOrganicWithSiriusAllAccessSuccess();
    cy.get('[data-test="FlepzYourInfoLink"]').click();
    fillOutFlepzForm();
    submitFlepzForm();
    cy.get('[data-test="yourInfo.continueButton"]').click();
};

export const enterAndSubmitLicensePlate = () => {
    cy.get('[data-test="CarInfoLicensePlateRadioButton').first().click({ force: true });
    cy.get('[data-test="radioLookupOptions.carInfoContinueButton"]').first().click();
    cy.get('[data-test="LookUpLicensePlateNumberTextField"]').clear().type('321COT');
    cy.get('[data-test="LicensePlateStateDropdown"]').first().click();
    cy.get('[title="CO"]').first().click();
    cy.get('[data-test="VinLookUpByLicenseAgreementCheckbox"]').click({ force: true });
    cy.get('[data-test="SubmitLicensePlateLookupButton"]').click();
    cy.get('[data-test="confirmVINContinue"]').click();
};

export const verifyLicensePlateAndLpzOnSiriusPlatform = () => {
    stubDeviceValidateAndAccountVerifySuccess();
    stubAccountNonPiiSatelliteAccordionOrganicTrialWithSiriusPlatform();
    stubOffersCustomerSatelliteOrganicWithSiriusAllAccessSuccess();
    stubIdentityDeviceLicensePlateSatelliteOrganicWithSiriusAllAccessSuccess();
    enterAndSubmitLicensePlate();
    enterAndSubmitLPZ();
};

export const verifyRadioIdAndLpzForSiriusPlatformChange = () => {
    verifyRadioIdAndLpzOnSiriusPlatform();
};

export const confirmPlatformChange = () => {
    stubOffersCustomerSatelliteOrganicWithSiriusPlatformChange();
    stubOffersInfoSatelliteAccordionOrganicSiriusMusicAndEntertainment();
    cy.get('[data-test="DifferentPlatformAcceptButton"]').click();
};

export const verifyRadioIdAndLpzOnSiriusPlatformAndConfirmChange = () => {
    stubOffersNoPromoSuccess();
    verifyRadioIdAndLpzForSiriusPlatformChange();
    confirmPlatformChange();
};

export const selectSavedPaymentAndContinue = () => {
    cy.get('[data-test="PaymentInfoExistingCard"]').click();
    cy.get('[data-test="PaymentConfirmationButton"]').click();
};

export const selectNewPaymentAndContinue = () => {
    cy.get('[data-test="PaymentInfoNewCard"]').click();
    cy.get('[data-test="PaymentConfirmationButton"]').click();
    fillOutAddNewCardBillingInfo();
    submitNewBillingInfoForm();
};

export const completeOrder = () => {
    cy.get('[data-test="ChargeMyCardText"]').click();
    cy.get('[data-test="reviewOrder.completeButton"]').click();
};

export const completeOrderWithSavedPayment = () => {
    selectSavedPaymentAndContinue();
    completeOrder();
};

export const completeChangePlatformCheckout = () => {
    stubQuotesQuoteSatelliteOrganicChangePlatformSuccess();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseChangeSubscription();
    stubUtilitySecurityQuestionsSuccess();
    completeOrderWithSavedPayment();
};

export const goThroughOrganicSatellitePurchaseFlowWithActiveTrialAndCardOnFile = () => {
    stubDeviceValidateAndAccountVerifySuccess();
    stubAccountNonPiiSatelliteOrganicWithTrialSubscription();
    enterAndSubmitRadioId();
    stubOffersCustomerSatelliteOrganicDefaultSelfPayOffersCustomerSuccess();
    enterAndSubmitLPZ();
};

export const stubCheckoutCompletion = () => {
    stubQuotesSatelliteOrganicPromoSelfPayAndCaptchaNotRequired();
    stubPurchaseChangeSubscription();
    stubUtilitySecurityQuestionsSuccess();
};

export const completeCheckoutWithCardOnFile = () => {
    stubCheckoutCompletion();
    completeOrderWithSavedPayment();
};

export const completeCheckoutWithNewPaymentMethodSelection = () => {
    stubCheckoutCompletion();
    stubValidateCustomerInfoNewCC();
    selectNewPaymentAndContinue();
    completeOrder();
};

export const completeCheckoutWithNewPaymentMethod = () => {
    stubCheckoutCompletion();
    stubValidateCustomerInfoNewCC();
    fillOutAddNewCardBillingInfo();
    submitNewBillingInfoForm();
    completeOrder();
};

export const identifyWithRadioIdAndNoCardOnFile = () => {
    stubDeviceValidateAndAccountVerifySuccess();
    stubAccountNonPiiSatelliteAccordionOrganicWithTrialAndNoCardOnFile();
    enterAndSubmitRadioId();
    stubOffersCustomerSatelliteOrganicDefaultSelfPayOffersCustomerSuccess();
    enterAndSubmitLPZ();
};

export const goThroughTargetedSatellitePurchaseFlowWithActiveTrialAndCardOnFile = () => {
    stubDeviceValidateAndAccountVerifySuccess();
    stubAccountNonPiiSatelliteTargetedWithTrialSubscription();
    stubOffersCustomerSatelliteTargetedSelfPayPromoOffer();
};

export const goThroughTargetedSatellitePurchaseFlowWithActiveTrialAndNoCardOnFile = () => {
    stubDeviceValidateAndAccountVerifySuccess();
    stubAccountNonPiiSatelliteAccordionOrganicWithTrialAndNoCardOnFile();
    stubOffersCustomerSatelliteTargetedSelfPayPromoOffer();
};
