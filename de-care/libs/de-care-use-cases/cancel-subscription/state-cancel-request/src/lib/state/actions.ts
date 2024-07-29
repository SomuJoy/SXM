import { createAction, props } from '@ngrx/store';
import { PaymentInfo, CancellationDetails, CurrentUTCDayHour } from './reducer';

export const setCancelReason = createAction('[Cancel Subscription] Set cancel reasons', props<{ cancelReason: string }>());
export const setSubscriptionId = createAction('[Cancel Subscription] Set subscription id', props<{ subscriptionId: number }>());
export const setCancelOnlyModeOn = createAction('[Cancel Subscription] Set cancelonly mode on');
export const setTransactionId = createAction('[Cancel Subscription] Set transaction id', props<{ transactionId: string }>());

export const setCancellationDetails = createAction('[Cancel Subscription] Set cancellation details', props<{ cancellationDetails: CancellationDetails }>());
export const cancelSubscriptionError = createAction('[Cancel] Cancel subscription error', props<{ error: any }>());

export const setPlanCode = createAction('[Cancel Subscription] Set plan code', props<{ planCode: string }>());
export const clearPlanCode = createAction('[Cancel Subscription] Clear plan code');
export const setCurrentUTCDayHour = createAction('[Cancel Subscription] Set current UTC day and hour', props<{ currentUTCDayHour: CurrentUTCDayHour }>());

export const setPaymentInfo = createAction('[Cancel Subscription] Set payment info', props<{ paymentInfo: PaymentInfo }>());
export const clearPaymentInfo = createAction('[Cancel Subscription] Clear payment info');
export const setToUseCardOnFile = createAction('[Cancel Subscription] Set to use card on file');
export const setToNotUseCardOnFile = createAction('[Cancel Subscription] Set to not use card on file');

export const setLoadReviewOrderDataAsProcessing = createAction('[Cancel Subscription] Set load review order data processing to true');
export const setLoadReviewOrderDataAsNotProcessing = createAction('[Cancel Subscription] Set load review order data processing to false');

export const setSubmitChangeSubscriptionDataAsProcessing = createAction('[Cancel Subscription] Set submit change subscription data processing to true');
export const setSubmitChangeSubscriptionDataAsNotProcessing = createAction('[Cancel Subscription] Set submit change subscription data processing to false');

export const setWillBeCancelledLaterToTrue = createAction('[Cancel Subscription] Set will be cancelled later to true');
export const setSelectedPackageNameFromOfferGrid = createAction('[Cancel Subscription] Set selected package name from offer grid', props<{ packageName: string }>());
export const preSelectedPlanDisplayed = createAction('[Cancel Subscription] Pre-selected plan displayed');
export const setCancelByChatAllowed = createAction('[Cancel Subscription] Set Cancel by chat allowed', props<{ cancelByChatAllowed: boolean }>());
export const setPreselectedPlanIsEnabled = createAction('[Cancel Subscription] Set preselected plan is enabled', props<{ preselectedPlanIsEnabled: boolean }>());
export const setCancelInterstitialPageFlagAsUsed = createAction('[Cancel Subscription] Set Cancel Interstitial page flag as used');
export const setCancelInterstitialPageDisplayed = createAction('[Cancel Subscription] Set Cancel Interstital page displayed');
export const newTransactionIdDueToFailureToCompleteProcess = createAction('[Cancel Subscription] Create new transaction id due to failure to complete transaction');
export const trackCancelOnlineRules = createAction('[Cancel Subscription] Track Cancel Online rules', props<{ subscriptionId: string | number }>());
export const setPlanIsSelectedFromGrid = createAction('[Cancel Subscription] Set Plan is selected from grid');
export const resetPlanIsSelectedFromGrid = createAction('[Cancel Subscription] Reset Plan is selected from grid');
export const setIsRefreshAllowed = createAction('[Cancel Subscription] Set allow refresh flag', props<{ isRefreshAllowed: boolean }>());
