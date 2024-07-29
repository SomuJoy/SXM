import { createAction, props } from '@ngrx/store';
import { PaymentInfo, TermType } from './reducer';

export const clearPurchaseFlowData = createAction('[Change Subscription] Clear purchase state');
export const setPlanCode = createAction('[Change Subscription] Set selected plan code', props<{ planCode: string }>());
export const setMarketingPromoCode = createAction('[Change Subscription] Set marketing promo code', props<{ marketingPromoCode: string }>());
export const clearMarketingPromoCode = createAction('[Change Subscription] Clear marketing promo code');
export const setCurrentAudioPackageAsSelectedPlanCode = createAction('[Change Subscription] Set current audio package as selected plan code');
export const setInfotainmentPlanCodes = createAction('[Change Subscription] Set selected infotainment plan code', props<{ planCodes: string[] }>());
export const clearPlanCode = createAction('[Change Subscription] Clear selected plan code');
export const setTermType = createAction('[Change Subscription] Set selected term type', props<{ termType: TermType }>());
export const clearTermType = createAction('[Change Subscription] Clear selected term type');
export const setToUseCardOnFile = createAction('[Change Subscription] Set to use card on file');
export const setToNotUseCardOnFile = createAction('[Change Subscription] Set to not use card on file');

export const setPaymentInfo = createAction('[Change Subscription] Set payment info', props<{ paymentInfo: PaymentInfo }>());
export const setSubscriptionId = createAction('[Change Subscription] Set current subscription id', props<{ subscriptionId: number }>());
export const setPaymentInfoCountry = createAction('[Change Subscription] Set payment info country', props<{ country: string }>());
export const clearPaymentInfo = createAction('[Change Subscription] Clear payment info');

export const setChangeTermOnlyModeOn = createAction('[Change Subscription] Set to only allow changing subscription term');
export const setTokenMode = createAction('[Change Subscription] Set to know if it is token mode or not', props<{ isTokenMode: boolean }>());

export const setLoadReviewOrderDataAsProcessing = createAction('[Change Subscription] Set load review order data processing to true');
export const setLoadReviewOrderDataAsNotProcessing = createAction('[Change Subscription] Set load review order data processing to false');

export const setSubmitChangeSubscriptionDataAsProcessing = createAction('[Change Subscription] Set submit change subscription data processing to true');
export const setSubmitChangeSubscriptionDataAsNotProcessing = createAction('[Change Subscription] Set submit change subscription data processing to false');
export const setPackageSelectionIsprocessing = createAction('[Change Subscription] Set package selection is processing to true');
export const setPackageSelectionIsNotprocessing = createAction('[Change Subscription] Set package selection is processing to false');
export const setPackageSelectionIsDowngrade = createAction('[Change Subscription] Set package selection is downgrade to true');
export const setPackageSelectionIsNotDowngrade = createAction('[Change Subscription] Set package selection is downgrade to false');
export const initTrackingInConfirmationPage = createAction('[Change Subscription] Init tracking in confirmation page');
export const initMultiPackageSelection = createAction('[Change Subscription] Init tracking in multipackage selection page');
export const setChangeSubscriptionOffersError = createAction('[Change Subscription] Set change subscription offers error', props<{ error: string }>());
export const setSelectedSubscriptionIDForSAL = createAction('[Change Subscription] Set selected subscription ID for SAL', props<{ selectedSubscriptionIDForSAL: string }>());

export const setTransactionId = createAction('[Change Subscription] Set transaction id', props<{ transactionId: string }>());
export const newTransactionIdDueToCreditCardError = createAction('[Change Subscription] Create new transaction id due to credit card failure');
export const setIsRefreshAllowed = createAction('[Change Subscription] Set allow refresh flag', props<{ isRefreshAllowed: boolean }>());
