import { Offer } from '@de-care/domains/offers/state-offers';
import { createAction, props } from '@ngrx/store';
import { PaymentInfo, Account, DefaultMode, EligibilityStatus, RadioService } from './reducer';

export const setModeToAccountConsolidation = createAction('[Account Consolidation and Service Continuity Targeted] Set mode to Account Consolidation');
export const setDefaultFlowMode = createAction('[Account Consolidation and Service Continuity Targeted] Set default mode of ACSC flow', props<{ defaultMode: DefaultMode }>());
export const setSelfPayIsPreSelected = createAction('[Account Consolidation and Service Continuity Targeted] Set self pay as pre selected');
export const setModeToServiceContinuity = createAction('[Account Consolidation and Service Continuity Targeted] Set mode to Service Continuity');
export const setModeToServicePortability = createAction('[Account Consolidation and Service Continuity Targeted] Set mode to Service Portability');
export const clearMode = createAction('[Account Consolidation and Service Continuity Targeted] Clear mode');
export const setTrialRadioAccount = createAction('[Account Consolidation and Service Continuity Targeted] Set trial radio account', props<{ trialRadioAccount: Account }>());
export const setFullTrialRadioId = createAction('[Account Consolidation and Service Continuity Targeted] Set full trial radio id', props<{ fullTrialRadioId: string }>());

export const setRadioIdToReplace = createAction('[Account Consolidation and Service Continuity Targeted] Set radio id to replace', props<{ radioIdToReplace: string }>());
export const setRemoveOldRadioId = createAction('[Account Consolidation and Service Continuity Targeted] Set remove old radio id', props<{ removeOldRadioId: boolean }>());
export const setSelectedPlanCode = createAction('[Account Consolidation and Service Continuity Targeted] Set selected plan code', props<{ planCode: string }>());
// This will get dispatched as soon as customer selects No or Yes on vehicle decision UX
// and should only get dispatched once from there
export const loadACSCOffers = createAction('[Account Consolidation and Service Continuity Targeted] Load ACSC offers', props<{ radioId: string }>());
export const setPaymentTypeAsInvoice = createAction('[Account Consolidation and Service Continuity Targeted] Set payment type as invoice');
export const setPaymentTypeAsCreditCard = createAction('[Account Consolidation and Service Continuity Targeted] Set payment type as credit card');
export const setPaymentMethodAsCardOnFile = createAction('[Account Consolidation and Service Continuity Targeted] Set payment method as card on file');
export const setPaymentMethodAsNotCardOnFile = createAction('[Account Consolidation and Service Continuity Targeted] Set payment method as not card on file');
export const setPaymentInfo = createAction('[Account Consolidation and Service Continuity Targeted] Set payment info', props<{ paymentInfo: PaymentInfo }>());
export const clearPaymentInfo = createAction('[Account Consolidation and Service Continuity Targeted] Clear payment info');
export const setTransactionId = createAction('[Account Consolidation and Service Continuity Targeted] Set transaction id', props<{ transactionId: string }>());
export const setSelectedOffer = createAction('[Account Consolidation and Service Continuity Targeted] Set the selected offer', props<{ offer: Offer }>());
export const setLoadQuoteDataAsProcessing = createAction('[Account Consolidation and Service Continuity Targeted] Set load quote data processing to true');
export const setLoadQuoteDataAsNotProcessing = createAction('[Account Consolidation and Service Continuity Targeted] Set load quote data processing to false');
export const setSubmitTransactionAsProcessing = createAction('[Account Consolidation and Service Continuity Targeted] Set submit transaction as processing to true');
export const setSubmitTransactionAsNotProcessing = createAction('[Account Consolidation and Service Continuity Targeted] Set submit transaction as processing to false');
export const setUserNameIsSameAsEmail = createAction('[Account Consolidation and Service Continuity Targeted] Set username is same as email');
export const setUserNameIsNotSameAsEmail = createAction('[Account Consolidation and Service Continuity Targeted] Set username is not same as email');
export const setShowOffersAsShown = createAction('[Account Consolidation and Service Continuity Targeted] Set show offers as shown');
export const setShowOffersAsHidden = createAction('[Account Consolidation and Service Continuity Targeted] Set show offers as hidden');
export const setProgramCode = createAction('[Account Consolidation and Service Continuity Targeted] Set program code', props<{ programCode: string }>());
export const setMarketingPromoCode = createAction('[Account Consolidation and Service Continuity Targeted] Set marketing promo code', props<{ marketingPromoCode: string }>());
export const setSelfPayRadioAsClosed = createAction('[Account Consolidation and Service Continuity Targeted] Set self pay radio as closed');
export const setSelfPayRadioAsNotClosed = createAction('[Account Consolidation and Service Continuity Targeted] Set show offers as not closed');
export const setSelectedSelfPaySubscriptionIdFromOAC = createAction(
    '[Account Consolidation and Service Continuity Targeted] Set the selected selypay subscription ID from OAC',
    props<{ subscriptionId: string }>()
);
export const setIsLoggedIn = createAction('[Account Consolidation and Service Continuity Targeted] Set is logged in to true');
export const setIsNotLoggedIn = createAction('[Account Consolidation and Service Continuity Targeted] Set is logged in to false');
export const resetFeatureStateToInitial = createAction('[Account Consolidation and Service Continuity Targeted] Reset the feature state to initial state data');
export const setEligibilityStatus = createAction(
    '[Account Consolidation and Service Continuity Targeted] Set eligibility status',
    props<{ eligibilityStatus: EligibilityStatus }>()
);
export const setSelfPayAccountNumberForACOnly = createAction(
    '[Account Consolidation and Service Continuity Targeted] Set self pay account number for AC only',
    props<{ selfPayAccountNumberForACOnly: string }>()
);
export const setSwapNewRadioService = createAction(
    '[Account Consolidation and Service Continuity Targeted] Set swap new radio service',
    props<{ swapNewRadioService: RadioService }>()
);
export const setSelectedSubscriptionIDForSAL = createAction(
    '[Account Consolidation and Service Continuity Targeted], Set selected Subscription ID for SAL',
    props<{ selectedSubscriptionIDForSAL: string }>()
);
export const newTransactionIdDueToCreditCardError = createAction(
    '[Account Consolidation and Service Continuity Targeted] Create new transaction id due to credit card failure'
);

export const setIsRefreshAllowed = createAction('[Account Consolidation and Service Continuity Targeted] Set allow refresh flag', props<{ isRefreshAllowed: boolean }>());
