import { createAction, props } from '@ngrx/store';
import {
    OfferModel,
    AccountModel,
    QuoteRequestModel,
    QuoteModel,
    RadioModel,
    UpsellRequestData,
    ClosedDeviceModel,
    PurchaseSubscriptionDataModel,
    PurchaseCreateAccountDataModel,
} from '@de-care/data-services';

export enum EPurchaseActions {
    CreditCardSelect = '[Payment] Select CC',
    ChangeStep = '[Purchase] Change Purchase Form Step',
    SetStepNumberForErrorRedirects = '[Payment] Set Step Number For Error Redirects',
    EnableDisableContinue = '[Purchase] Enable or Disable Continue Button',
    ReceivePrepaid = '[Prepaid] Get Data Back',
    RemovePrepaid = '[Prepaid] Remove Prepaid',
    ContinueForm = '[Purchase] Continue',
    CollectForm = '[Payment] Collect Data',
    ClearForm = '[Payment] Empty Data',
    ClearFormButKeepCredentials = '[Payment] Empty Data but keep credentials',
    LoadData = '[Payment] Load data',
    LoadQuote = '[Payment] Load quote',
    PopulateQuote = '[Payment] Populate quote',
    UpdatePurchaseAccount = '[Payment] Update account email',
    AddCCTransactionId = '[Payment] Add CC transaction id',
    SetFlepzForm = '[Payment] Set flepz from',
    GetUpsells = '[Upsell] Sending Upsell Request',
    ReceiveUpsells = '[Upsell] Receiving Upsell Payload',
    SetUpsellCode = '[Upsell] Set Upsell Code',
    LoadSelectedOffer = '[Upsell] Load selected offer',
    GetPackageDesc = '[Upsell] Fetching Package Descriptions',
    AgreementAccepted = '[Upsell] Agreeement accepted',
    LoadFlepzDataSuccess = '[Upsell] Load Flepz Data Success',
    LoadFlepzData = '[Upsell] Load Account Flepz Data',
    LoadFlepzAccountToVerify = '[Purchase] Load Flepz Account To Verify',
    VerifyFlepzAccount = '[Purchase] Verify Flepz Account',
    ChangeSubscription = '[Submit] Change Subscription',
    AddSubscription = '[Submit] Add Subscription',
    CreateAccount = '[Submit] Create Account',
    CCError = '[Submit] Credit Card Error',
    ResetTransactionId = '[Submit] Reset transaction id',
    ServiceError = '[Error] General Service Error',
    PasswordInvalidError = '[Error] Password Invalid Error',
    PasswordContainsPiiDataError = '[Error] Password Contains Pii Data Error',
    UpdateOfferStreamingFlag = '[Purchase] Update offer streaming eligibility indicator',
    UpdateIsAddSubscriptionFlag = '[Purchase] Update Add-Subscription indicator',
    SetMarketingPromoCode = '[Purchase] Set the Marketing PromoCode',
    ClearMarketingPromoCode = '[Purchase] Clear the Marketing PromoCode',
    SetPlatformChangedFlag = '[Purchase] Set Platform changed flag',
    SetPlatformChangeUpsellDeferred = '[Purchase] Set platform change upsell deferred',
    UpdateRegistrationEligibilityFlag = '[Purchase] Update is Registration Eligible indicator',
    UpdateIsTwoFactorAuthNeededFlag = '[Purchase] Update is 2FA Needed indicator',
    LoadQuoteFromUpdatedOffer = '[Purchase] Load Quote from Updated Offer',
    UpdateMaskedPhoneNumber = '[Purchase] Update Masked Phone Number',
    newTransactionIdDueToCreditCardError = '[Purchase] Create new transaction id due to credit card failure',
    setTransactionId = '[Purchase] Set transaction id',
    setIsRefreshAllowed = '[Purchase] Set allow refresh flag',
}

export const ReceivePrepaid = createAction(EPurchaseActions.ReceivePrepaid, props<{ payload: any }>());

export const RemovePrepaid = createAction(EPurchaseActions.RemovePrepaid);

export const SetFlepzForm = createAction(EPurchaseActions.SetFlepzForm, props<{ payload: boolean }>());

export const CreditCardSelect = createAction(EPurchaseActions.CreditCardSelect, props<{ payload: boolean }>());

export const GetUpsells = createAction(EPurchaseActions.GetUpsells, props<{ payload: UpsellRequestData }>());

export const ReceiveUpsells = createAction(EPurchaseActions.ReceiveUpsells, props<{ payload: any }>());

export const SetUpsellCode = createAction(EPurchaseActions.SetUpsellCode, props<{ payload: string }>());

export const GetPackageDesc = createAction(EPurchaseActions.GetPackageDesc, props<{ payload: Array<any> }>());

export const ChangeStep = createAction(EPurchaseActions.ChangeStep, props<{ payload: number }>());

export const SetStepNumberForErrorRedirects = createAction(EPurchaseActions.SetStepNumberForErrorRedirects, props<{ payload: number }>());

export const EnableDisableContinue = createAction(EPurchaseActions.EnableDisableContinue, props<{ payload: boolean }>());
// TODO: payload must be an interface instead of any
export const ContinueForm = createAction(EPurchaseActions.ContinueForm, props<{ payload: any }>());
// TODO: payload must be an interface instead of any
export const CollectForm = createAction(EPurchaseActions.CollectForm, props<{ payload: any }>());

export const ClearForm = createAction(EPurchaseActions.ClearForm);
export const ClearFormButKeepCredentials = createAction(EPurchaseActions.ClearFormButKeepCredentials);

export const LoadQuote = createAction(EPurchaseActions.LoadQuote, props<{ payload: QuoteRequestModel }>());

export const LoadSelectedOffer = createAction(EPurchaseActions.LoadSelectedOffer, props<{ payload: OfferModel }>());

export const newTransactionIdDueToCreditCardError = createAction(EPurchaseActions.newTransactionIdDueToCreditCardError);

export const setTransactionId = createAction(EPurchaseActions.setTransactionId, props<{ transactionId: string }>());

export const setIsRefreshAllowed = createAction(EPurchaseActions.setIsRefreshAllowed, props<{ isRefreshAllowed: boolean }>());

export const LoadFlepzData = createAction(
    EPurchaseActions.LoadFlepzData,
    props<{
        payload: {
            radio: RadioModel | ClosedDeviceModel;
            account: AccountModel;
            accountNumber: string;
            stepNumber: number;
            platformChanged: boolean;
            deferredUpsell?: boolean;
        };
    }>()
);

export const LoadFlepzDataSuccess = createAction(
    EPurchaseActions.LoadFlepzDataSuccess,
    props<{ payload: { offer: OfferModel; programCode: string; account?: AccountModel } }>()
);

export const VerifyFlepzAccount = createAction(
    EPurchaseActions.VerifyFlepzAccount,
    props<{ payload: { account: AccountModel; loadUpsells: boolean; stepNumber?: number; retrieveFallbackOffer: boolean; state?: string; isStreaming?: boolean } }>()
);

export const PopulateQuote = createAction(EPurchaseActions.PopulateQuote, props<{ payload: QuoteModel }>());

export const AgreementAccepted = createAction(EPurchaseActions.AgreementAccepted, props<{ payload: boolean }>());

export const LoadData = createAction(EPurchaseActions.LoadData, props<{ payload: { offer: OfferModel; account: AccountModel; programCode: string } }>());

export const CCError = createAction(EPurchaseActions.CCError, props<{ payload: any }>());

export const ResetTransactionId = createAction(EPurchaseActions.ResetTransactionId, props<{ payload: any }>());

export const ChangeSubscription = createAction(EPurchaseActions.ChangeSubscription, props<{ payload: PurchaseSubscriptionDataModel }>());

export const AddSubscription = createAction(EPurchaseActions.AddSubscription, props<{ payload: PurchaseSubscriptionDataModel }>());

export const CreateAccount = createAction(EPurchaseActions.CreateAccount, props<{ payload: PurchaseCreateAccountDataModel }>());

export const UpdatePurchaseAccount = createAction(EPurchaseActions.UpdatePurchaseAccount, props<{ payload: AccountModel }>());

export const AddCCTransactionId = createAction(EPurchaseActions.AddCCTransactionId, props<{ payload: any }>());

export const ServiceError = createAction(EPurchaseActions.ServiceError, props<{ payload: any }>());

export const PasswordInvalidError = createAction(EPurchaseActions.PasswordInvalidError, props<{ payload: boolean }>());
export const PasswordContainsPiiDataError = createAction(EPurchaseActions.PasswordContainsPiiDataError, props<{ payload: boolean }>());

export const UpdateOfferStreamingFlag = createAction(EPurchaseActions.UpdateOfferStreamingFlag, props<{ payload: boolean }>());

export const UpdateIsAddSubscriptionFlag = createAction(EPurchaseActions.UpdateIsAddSubscriptionFlag, props<{ payload: boolean }>());

export const SetMarketingPromoCode = createAction(EPurchaseActions.SetMarketingPromoCode, props<{ payload: { promocode: string; hidePromoCode?: boolean } }>());

export const ClearMarketingPromoCode = createAction(EPurchaseActions.ClearMarketingPromoCode);

export const SetPlatformChangedFlag = createAction(EPurchaseActions.SetPlatformChangedFlag, props<{ payload: boolean }>());
export const SetPlatformChangeUpsellDeferred = createAction(EPurchaseActions.SetPlatformChangeUpsellDeferred, props<{ upsellDeferred: boolean }>());

export const LoadQuoteFromUpdatedOffer = createAction(
    EPurchaseActions.LoadQuoteFromUpdatedOffer,
    props<{ payload: { account: AccountModel; upgrade: any; formStep: number } }>()
);

export const UpdateRegistrationEligibilityFlag = createAction(EPurchaseActions.UpdateRegistrationEligibilityFlag, props<{ payload: boolean }>());

export const UpdateIsTwoFactorAuthNeededFlag = createAction(EPurchaseActions.UpdateIsTwoFactorAuthNeededFlag, props<{ isTwoFactorAuthNeeded: boolean }>());

export const UpdateMaskedPhoneNumber = createAction(EPurchaseActions.UpdateMaskedPhoneNumber, props<{ maskedPhoneNumber: string }>());

export const updatePurchaseFormSteps = createAction('[Purchase] update form steps', props<{ steps: string[] }>());

export const setSuccessfulTransactionSubscriptionId = createAction('[Purchase] Set successful transaction subscription id', props<{ subscriptionId: string }>());

export const resetPurchaseStateToInitial = createAction('[Purchase] Reset purchase-state to initial state data');
export const resetPurchaseStatePaymentInfoToInitial = createAction('[Purchase] Reset purchase-state paymentInfo to initial state data');
export const resetPurchaseStatePrepaidCardToInitial = createAction('[Purchase] Reset purchase-state to prepaidCard initial state data');
export const resetPurchaseStatePackageUpgradesToInitial = createAction('[Purchase] Reset purchase-state to packageUpgrades initial state data');
export const resetPurchaseStateReviewOrderToInitial = createAction('[Purchase] Reset purchase-state to reviewOrder initial state data');
export const resetPurchaseStateFormStatusToInitial = createAction('[Purchase] Reset purchase-state to formStatus initial state data');
export const resetPurchaseStateDataToInitial = createAction('[Purchase] Reset purchase-state to data initial state data');
export const resetPurchaseStateServiceErrorToInitial = createAction('[Purchase] Reset purchase-state to serviceError initial state data');
export const LoadSelectedChoicePlan = createAction('[Purchase] Load selected Choice Plan', props<{ payload: OfferModel }>());
