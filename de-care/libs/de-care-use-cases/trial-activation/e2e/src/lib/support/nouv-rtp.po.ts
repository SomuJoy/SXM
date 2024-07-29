import {
    e2eAddress,
    e2eCcCVV,
    e2eCcExp,
    e2eCcName,
    e2eCcNum,
    e2eCity,
    e2eCreateAccountSubmitButton,
    e2eEmailField,
    e2ePaymentInfoFormGroup,
    e2ePhoneNumberField,
    e2eServiceAddressFormGroup,
    e2eServiceAddressSame,
    e2eState,
    e2eTrialActivationRtpCreateAccountComponent,
    e2eTrialActivationRtpCreateAccountVehicleEligibilityText,
    e2eTrialActivationRtpNotYourCarLink,
    e2eZip
} from '@de-care/de-care-use-cases/trial-activation/rtp/feature-create-account';
import { e2eTrialActivationRtpReviewComponent, e2eCompleteMyOrderButton, e2eCheckButtonAcceptOffer } from '@de-care/de-care-use-cases/trial-activation/rtp/feature-review';
import { getDigitalDataCustomerInfo, getDigitalDataDeviceInfo, getDigitalDataPageInfo } from '@de-care/shared/e2e';

export const cyGetTrialActivationRtpCreateAccountVehicleEligibilityText = () => cy.get(e2eTrialActivationRtpCreateAccountVehicleEligibilityText);
export const cyGetTrialActivationRtpCreateAccountComponent = () => cy.get(e2eTrialActivationRtpCreateAccountComponent);
export const cyGetTrialActivationRtpNotYourCarLink = () => cy.get(e2eTrialActivationRtpNotYourCarLink);
export const cyGetCreateAccountSubmitButton = () => cy.get(e2eCreateAccountSubmitButton);
export const cyGetEmailField = () => cy.get(e2eEmailField);
export const cyGetPhoneNumberField = () => cy.get(e2ePhoneNumberField);
export const cyGetPaymentInfoFormGroup = () => cy.get(e2ePaymentInfoFormGroup);
export const cyGetServiceAddressFormGroup = () => cy.get(e2eServiceAddressFormGroup);
export const cyGetAddress = () => cy.get(e2eAddress);
export const cyGetCity = () => cy.get(e2eCity);
export const cyGetState = () => cy.get(e2eState);
export const cyGetZip = () => cy.get(e2eZip);
export const cyGetCcName = () => cy.get(e2eCcName);
export const cyGetCcNum = () => cy.get(e2eCcNum);
export const cyGetCcExp = () => cy.get(e2eCcExp);
export const cyGetCcCVV = () => cy.get(e2eCcCVV);
export const cyGetServiceAddressSame = () => cy.get(e2eServiceAddressSame);
export const cyGetTrialActivationRtpReviewComponent = () => cy.get(e2eTrialActivationRtpReviewComponent);
export const cyGetCompleteMyOrderButton = () => cy.get(e2eCompleteMyOrderButton);
export const cyGetCheckButtonAcceptOffer = () => cy.get(e2eCheckButtonAcceptOffer);

// Data layer

export const dataLayerHasRTPTrialCreateAccountPageRecord = () => {
    getDigitalDataPageInfo()
        .its('flowName')
        .should('equal', 'CHECKOUT');
    getDigitalDataPageInfo()
        .its('componentName')
        .should('equal', 'paymentInfo');
};

export const dataLayerHasCustomerTypeRecord = () => {
    getDigitalDataCustomerInfo()
        .its('customerType')
        .should('equal', 'RTP_TRIAL_ACTIVATION');
};

export const dataLayerHasRecordForSessionId = sessionId => {
    getDigitalDataCustomerInfo()
        .its('sessionId')
        .should('equal', sessionId);
};

export const dataLayerHasRecordForTransactionId = () => {
    getDigitalDataCustomerInfo()
        .its('transactionId')
        .should('not.be.empty');
};

export const dataLayerHasRecordForRadioId = radioId => {
    getDigitalDataDeviceInfo()
        .its('esn')
        .should('equal', radioId);
};

export const dataLayerHasRecordForProgramCode = programCode => {
    getDigitalDataDeviceInfo()
        .its('programCode')
        .should('equal', programCode);
};

export const dataLayerHasRecordForPromoCode = promoCode => {
    getDigitalDataDeviceInfo()
        .its('promoCode')
        .should('equal', promoCode);
};

export const dataLayerHasRecordForDeviceStatus = deviceStatus => {
    getDigitalDataDeviceInfo()
        .its('status')
        .should('equal', deviceStatus);
};

export const dataLayerHasRTPTrialReviewPageRecord = () => {
    getDigitalDataPageInfo()
        .its('flowName')
        .should('equal', 'CHECKOUT');
    getDigitalDataPageInfo()
        .its('componentName')
        .should('equal', 'review');
};

export const dataLayerHasRTPTrialConfirmationPageRecord = () => {
    getDigitalDataPageInfo()
        .its('flowName')
        .should('equal', 'CHECKOUT');
    getDigitalDataPageInfo()
        .its('componentName')
        .should('equal', 'confirmation');
};
