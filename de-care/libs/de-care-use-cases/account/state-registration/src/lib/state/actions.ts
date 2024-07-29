import { HttpErrorResponse } from '@angular/common/http';
import { AccountProfileResponse, RegisterNonPiiResponse } from '@de-care/domains/account/state-account';
import { SecurityQuestionsAnswersModel } from '@de-care/domains/account/state-security-questions';
import { AddressValidationState } from '@de-care/domains/customer/state-customer-verification';
import { createAction, props } from '@ngrx/store';
import { CNAFormData, FlepzData, RegistrationDataStillNeeded, VerificationMethods, VerificationOptions } from './models';

export const submitFlepzData = createAction('[Registration] Submit FLEPZ data', props<{ flepzData: FlepzData }>());
export const parsedFlepzDataSubmission = createAction('[Registration] FLEPZ data parsed', props<{ flepzData: FlepzData }>());
export const submitFlepzDataSettled = createAction('[Registration] FLEPZ data submission settled', props<{ hasError: boolean }>());

export const setMaskedPhoneNumberVerification = createAction('[Registration] Set masked phone number', props<{ maskedPhoneNumber: string }>());
export const setIsEmailAddressOnFileVerification = createAction('[Regitration] Set email address on file', props<{ emailOnFile: boolean }>());
export const setIsPhoneNumberOnFileVerification = createAction('[Registration] Set phone number on file', props<{ phoneOnFile: boolean }>());
export const setMaskedPhoneNumberLookup = createAction('[Registration] Set masked phone number', props<{ maskedPhoneNumber: string }>());
export const setIsEmailAddressOnFileLookup = createAction('[Regitration] Set email address on file', props<{ emailOnFile: boolean }>());

export const setFlepzData = createAction('[Registration] Set FLEPZ data', props<{ flepzData: FlepzData }>());

export const fetchVerificationOptions = createAction('[Registration] Verify options call initiated', props<{ last4DigitsOfAccountNumber: string }>());
export const fetchVerificationOptionsForOneAccountFound = createAction(
    '[Registration] Verify options call initiated when one account found',
    props<{ last4DigitsOfAccountNumber: string }>()
);
export const fetchVerificationOptionsWhenInStepUpFlow = createAction(
    '[Registration] Verify options call initiated when in step up flow',
    props<{ last4DigitsOfAccountNumber: string }>()
);
export const getVerificationOptionsForUnregisteredAccount = createAction(
    '[Registration] Fetch verification options for unregistered account',
    props<{ last4DigitsOfAccountNumber: string }>()
);

export const setVerificationOptions = createAction('[Registration] Set verification options', props<{ verificationOptions: VerificationOptions }>());
export const setVerificationMethods = createAction('[Registration] Set verification methods', props<{ verificationMethods: VerificationMethods }>());
export const fetchVerificationOptionsSettled = createAction('[Registration] Verify options call settled', props<{ hasError: boolean }>());

export const accountAlreadyRegistered = createAction('[Registration] Account already registered');
export const accountIsNOTAlreadyRegistered = createAction('[Registration] Account is not Already registered', props<{ response: RegisterNonPiiResponse }>());

export const setSystemErrorInFlepz = createAction('Registration] Set System Error in FLEPZ');
export const resetSystemErrorInFlepz = createAction('Registration] Reset System Error in FLEPZ');
export const setInvalidPhoneInFlepz = createAction('Registration] Set Invalid phone in FLEPZ');
export const resetInvalidPhoneInFlepz = createAction('Registration] Reset Invalid phone in FLEPZ');

export const setUserName = createAction('[Registration] set UserName', props<{ userName: string }>());
export const setUserBehaviorPayload = createAction('[Registration] set UserBehaviorPayload', props<{ userBehaviorPayload: string }>());
export const setFirstName = createAction('[Registration] set FirstName', props<{ firstName: string }>());

export const submitLookupAccountByRadioIdOrAccountNumber = createAction(
    '[Registration] Submit Lookup Account By Radio ID or Account number',
    props<{ radioId?: string; accountNumber?: string }>()
);

export const submitLookupAccountByRadioIdOrAccountNumberSuccess = createAction(
    '[Registration] Submit Lookup Account By Radio ID or Account Success',
    props<{ isInPreTrial: boolean; accountRegistered: boolean; last4DigitsOfAccountNumber: string }>()
);

export const submitLookupAccountByRadioIdOrAccountNumberFailed = createAction(
    '[Registration] Submit Lookup Account By Radio ID or Account Failed',
    props<{ error: HttpErrorResponse }>()
);

export const isInCNA = createAction(
    '[Registration] User Is In CNA Beat The Sold Scenario',
    props<{ isInPreTrial: boolean; accountRegistered: boolean; last4DigitsOfAccountNumber: string }>()
);

export const setLookupAccountByRadioIdError = createAction('[Registration] Set Lookup Account By Radio ID Error');

export const setLookupAccountByAccountNumberError = createAction('[Registration] Set Lookup Account By Account # Error');

export const validateAddress = createAction('[Registration] Validate CNA Form Address', props<{ CNAFormData: CNAFormData }>());
export const validateAddressError = createAction('[Registration] Validate CNA Form Address Has Error', props<{ CNAFormValidationError: AddressValidationState }>());
export const clearValidateAddresError = createAction('[Registration] Clear Validate Address Error');
export const clearValidateAddresErrorOnModalClose = createAction('[Registration] Clear Validate Address Error When Modal Closes');
export const proceedWithCorrectedAddress = createAction('[Registration] Proceed with corrected CNA Form Validated Address');
export const setCNAFormData = createAction('[Registration] Set CNA form data', props<{ CNAFormData: CNAFormData }>());
export const setCNAFormDataOnSubmission = createAction('[Registration] Set CNA form data on submit', props<{ CNAFormData: CNAFormData }>());
export const validateUserName = createAction('[Registration] validate user name reuse');
export const userNameValidated = createAction('[Registration] user name validated');

export const registerAccount = createAction(
    '[Registration] set registration data',
    props<{
        emailData: { email: string };
        loginCredentials: { password: string; email: string };
        phoneNumberData: { phoneNumber: string };
        securityQuestionsData: SecurityQuestionsAnswersModel;
    }>()
);
export const accountRegisteredSuccess = createAction('[Registration] account successfully registered', props<{ loginCredentials: { password: string; username: string } }>());
export const accountRegistrationFailedPasswordValidation = createAction('[Registration] account registration failed password validation');
export const accountRegistrationFailedOther = createAction('[Registration] account registration failed for other reasons');

export const accountAlreadyRegisteredGoToLogin = createAction('[Registration] Account Is Already Registered Go To Login');
export const accountResponseHasData = createAction('[Registration] Account Response returns data', props<{ response: RegisterNonPiiResponse }>());
export const accountResponseHasNoData = createAction('[Registration] Account Response returns no data', props<{ accountNumber: boolean; radioID: boolean }>());
export const accountHasDemoSubscription = createAction('[Registration] Account has demo subscription');
export const accountFoundCannotBeVerified = createAction('[Registration] Account Found Cannot Be Verified');
export const setRegistrationDataNeeded = createAction(
    '[Registration] Set registration data that still needs to be collected',
    props<{ registrationDataStillNeeded: RegistrationDataStillNeeded }>()
);
export const accountIsInStepUpScenario = createAction(
    '[Registration] Account is In Step Up Flow Scenario',
    props<{
        response: RegisterNonPiiResponse;
    }>()
);
export const lpzVerificationSuccess = createAction('[Registration] LPZ Verification Succeeded');
export const lpzVerificationFailed = createAction('[Registration] LPZ Verification Failed');
export const accountIsIdentifiedAndVerified = createAction('[Registration] Account Is Identified And Verified');

export const doTwoFactorAuthOnAccountNotFound = createAction('[Registration] Do Two Factor Auth For Account Not Found Scenario');
export const twoFactorAuthCompleted = createAction('[Registration] Two Factor Auth Completed');
export const setVerificationOptionsForNoAccountFound = createAction('[Registration] Set verification options', props<{ verificationMethods: VerificationMethods }>());
export const clearLookupErrors = createAction('[Registration] Clear lookup errors');
export const setAccountNotFoundLinkClick = createAction('[Registration] Set Click on Account Not Found Link');
export const resetAccountNotFoundLinkClick = createAction('[Registration] Reset Click on Account Not Found Link');
export const setEmailFromAccount = createAction('[Registration] Account Email from Account', props<{ email: string }>());
export const setEmailOnAccountFromConfirmation = createAction('[Registration] Set Email On Account From Confirm Email Registration Page', props<{ email: string }>());
export const clearEmailFromFlepzWhenNoAccountFound = createAction('[Registration] Clear Email Set From FLEPZ when No Account Found');
export const setLast4DigitsOfRadioId = createAction('[Registration] Set Last 4 Digits of the RadioId', props<{ last4RadioId: string }>());
export const getAccountProfile = createAction('[Registration] Get Account Profile');
export const getAccountProfileSuccess = createAction('[Registration] Get Account Profile Success', props<{ response: AccountProfileResponse }>());
export const setLast4DigitsOfAccountNumber = createAction('[Registration] Set Last 4 Digits of Account #', props<{ last4DigitsOfAccountNumber: string }>());
export const setIsEmailEligibleForUserName = createAction(
    '[Registration] Set isEmailEligibleForUserName From Unique Login when In Beat The Sold',
    props<{ valid: boolean }>()
);
export const registrationDataReady = createAction('[Registration] Registration Data Ready');
export const uiLookupModalClosed = createAction('[Registration] UILookupModal Closed Button Clicked');

export const setRegistrationUsernameError = createAction('[Registration] Set Registration Username Error');
export const setRegistrationSystemError = createAction('[Registration] Set Registration System Error');
export const setRegistrationPasswordInvalid = createAction('[Registration] Set Registration Password Invalid Error');
export const setRegistrationPasswordContainsPiiData = createAction('[Registration] Set Registration Password Contains PII Data');
