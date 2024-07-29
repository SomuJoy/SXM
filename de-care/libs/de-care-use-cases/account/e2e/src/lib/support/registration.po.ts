import {
    e2eRegistrationCompletedGoToMyAccountCallToAction,
    e2eRegistrationCompletedInstructionsText,
    e2eRegistrationCompletedListenNowCallToAction,
    e2eRegistrationCompletedTitleText,
    e2eRegistrationForm,
    e2eRegistrationFormCompleteRegistrationButton,
    e2eRegistrationFormEmailTextfield,
    e2eRegistrationFormNextStepButton,
    e2eRegistrationFormPhoneNumberTextfield,
    e2eRegistrationFormSecurityQuestionsFormFields,
    e2eRegistrationIdentificationFlepzForm,
    e2eRegistrationIdentificationFlepzFormContinueButton,
    e2eRegistrationIdentificationHaveAccount,
    e2eRegistrationIdentificationInstructions,
    e2eRegistrationIdentificationTitle,
    e2eVerifySingleAccountButton
} from '@de-care/de-care-use-cases/account/feature-registration';
import { e2eAccountSubscriptionsInfoVerifyLink } from '@de-care/domains/account/ui-account-and-subscriptions-info';
import {
    e2e2faModalSecurityCodeForm,
    e2e2faModalVerifyOptionsForm,
    e2eVerifyOptionsFormContinueButton,
    e2eVerifyOptionsFormEmail,
    e2eVerifyOptionsFormPhoneNumberLabel,
    e2eVerifyOptionsFormPhoneNumberField,
    e2eVerifyOptionsFormPhoneNumberAcceptTerms,
    e2eVerifyOptionsFormRadioIdField,
    e2eVerifyOptionsFormRadioIdLabel,
    e2eVerifyOptionsFormAccountNumberLabel,
    e2eVerifyOptionsFormAccountNumberField,
    e2eSecurityCodeVerificationFormSecurityCodeField,
    e2eSecurityCodeVerificationFormSubmitSecurityCode
} from '@de-care/domains/account/ui-two-factor-auth';
import { e2eFlepzFormContinueButton, e2eVerifyDeviceTabsFlepzForm } from '@de-care/identification';
import { e2eFlepzVerifyDeviceTabs } from '@de-care/purchase';
import { e2eCheckboxFormField } from '@de-care/shared/sxm-ui/ui-checkbox-with-label-form-field';
import {
    e2eFlepzEmailTextfield,
    e2eFlepzFirstNameTextfield,
    e2eFlepzLastNameTextfield,
    e2eFlepzPhoneNumberTextfield,
    e2eFlepzZipCodeTextfield
} from '@de-care/shared/sxm-ui/ui-flepz-form-fields';

export const cyGetE2eRegistrationIdentificationFlepzForm = () => cy.get(e2eRegistrationIdentificationFlepzForm);
export const cyGetE2eRegistrationIdentificationTitle = () => cy.get(e2eRegistrationIdentificationTitle);
export const cyGetE2eRegistrationIdentificationInstructions = () => cy.get(e2eRegistrationIdentificationInstructions);
export const cyGetE2eRegistrationIdentificationHaveAccount = () => cy.get(e2eRegistrationIdentificationHaveAccount);

export const cyGetE2eRegistrationIdentificationFlepzFormContinueButton = () => cy.get(e2eRegistrationIdentificationFlepzFormContinueButton);

export const cyGetFlepzFirstNameTextfield = () => cy.get(e2eFlepzFirstNameTextfield);
export const cyGetFlepzLastNameTextfield = () => cy.get(e2eFlepzLastNameTextfield);
export const cyGetFlepzPhoneNumberTextfield = () => cy.get(e2eFlepzPhoneNumberTextfield);
export const cyGetFlepzZipCodeTextfield = () => cy.get(e2eFlepzZipCodeTextfield);
export const cyGetFlepzEmailTextfield = () => cy.get(e2eFlepzEmailTextfield);

export const cyGetFlepzVerifyDeviceTabs = () => cy.get(e2eFlepzVerifyDeviceTabs);
export const cyGetVerifyDeviceTabsFlepzForm = () => cy.get(e2eVerifyDeviceTabsFlepzForm);

export const cyGetFlepzFormContinueButton = () => cy.get(e2eFlepzFormContinueButton);

export const cyGetRegistrationForm = () => cy.get(e2eRegistrationForm);
export const cyGetRegistrationFormEmailTextfield = () => cy.get(e2eRegistrationFormEmailTextfield);
export const cyGetRegistrationFormPhoneNumberTextfield = () => cy.get(e2eRegistrationFormPhoneNumberTextfield);
export const cyGetRegistrationFormSecurityQuestionsFormFields = () => cy.get(e2eRegistrationFormSecurityQuestionsFormFields);
export const cyGetRegistrationFormNextStepButton = () => cy.get(e2eRegistrationFormNextStepButton);
export const cyGetRegistrationFormCompleteRegistrationButton = () => cy.get(e2eRegistrationFormCompleteRegistrationButton);

export const cyGetRegistrationCompletedTitleText = () => cy.get(e2eRegistrationCompletedTitleText);
export const cyGetRegistrationCompletedInstructionsText = () => cy.get(e2eRegistrationCompletedInstructionsText);
export const cyGetRegistrationCompletedGoToMyAccountCallToAction = () => cy.get(e2eRegistrationCompletedGoToMyAccountCallToAction);
export const cyGetRegistrationCompletedListenNowCallToAction = () => cy.get(e2eRegistrationCompletedListenNowCallToAction);

export const cyGetVerifyOptionsFormEmail = () => cy.get(e2eVerifyOptionsFormEmail);

export const cyGetVerifyOptionsFormPhoneNumberLabel = () => cy.get(e2eVerifyOptionsFormPhoneNumberLabel);
export const cyGetVerifyOptionsFormPhoneNumberField = () => cy.get(e2eVerifyOptionsFormPhoneNumberField);
export const cyGetVerifyOptionsFormPhoneNumberAcceptTerms = () => cy.get(e2eVerifyOptionsFormPhoneNumberAcceptTerms);

export const cyGetVerifyOptionsFormRadioIdLabel = () => cy.get(e2eVerifyOptionsFormRadioIdLabel);
export const cyGetVerifyOptionsFormRadioIdField = () => cy.get(e2eVerifyOptionsFormRadioIdField);
export const cyGetVerifyOptionsFormAccountNumberLabel = () => cy.get(e2eVerifyOptionsFormAccountNumberLabel);
export const cyGetVerifyOptionsFormAccountNumberField = () => cy.get(e2eVerifyOptionsFormAccountNumberField);
export const cyGetVerifyOptionsFormContinueButton = () => cy.get(e2eVerifyOptionsFormContinueButton);

export const cyGetAccountSubscriptionsInfoVerifyLink = () => cy.get(e2eAccountSubscriptionsInfoVerifyLink);
export const cyGet2faModalVerifyOptionsForm = () => cy.get(e2e2faModalVerifyOptionsForm);
export const cyGet2faModalSecurityCodeForm = () => cy.get(e2e2faModalSecurityCodeForm);

export const cyGetVerifySingleAccountButton = () => cy.get(e2eVerifySingleAccountButton);

export const cyGetCheckboxFormField = () => cy.get(e2eCheckboxFormField);

export const cyGetSecurityCodeVerificationFormSecurityCodeField = () => cy.get(e2eSecurityCodeVerificationFormSecurityCodeField);
export const cyGetSecurityCodeVerificationFormSubmitSecurityCode = () => cy.get(e2eSecurityCodeVerificationFormSubmitSecurityCode);
