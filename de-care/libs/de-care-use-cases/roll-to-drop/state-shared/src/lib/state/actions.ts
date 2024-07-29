import { createAction, props } from '@ngrx/store';
import { RTDAccountInfo } from '../models/account-info-models';
import { RTDPaymentInfo } from '../models/payment-info-models';

export const setAccountInfo = createAction('[RTD Trial Activation] Set account info', props<{ accountInfo: RTDAccountInfo }>());
export const setPaymentInfo = createAction('[RTD Trial Activation] Set payment info', props<{ paymentInfo: RTDPaymentInfo }>());
export const clearPaymentInfo = createAction('[RTD Trial Activation] Clear payment info');
export const setPromoCode = createAction('[RTD Trial Activation] Set promo code', props<{ promoCode: string }>());
export const setProgramCode = createAction('[RTD Trial Activation] Set program code', props<{ programCode: string }>());
export const setLangPref = createAction('[RTD Trial Activation] Set Language Preference', props<{ langPref: string }>());
export const setOfferNotAvailable = createAction('[RTD Trial Activation] Set Offer Not Available', props<{ offerNotAvailableReason: string }>());
export const setShowFollowOn = createAction('[RTD Trial Activation] Set Show Follow On', props<{ showFollowOnSelection: boolean }>());
export const setNewAccountResults = createAction(
    '[RTD Trial Activation] Set new account with subscription results',
    props<{ subscriptionId: number; isOfferStreamingEligible: boolean; isEligibleForRegistration: boolean; email: string }>()
);

export const setLoadYourInfoDataAsProcessing = createAction('[RTD Trial Activation] Set load your info data processing to true');
export const setLoadYourInfoDataAsNotProcessing = createAction('[RTD Trial Activation] Set load your info data processing to false');

export const setDisplayNuCaptcha = createAction('[RTD Trial Activation] Set Display nucaptcha');
export const setMaskedEmail = createAction('[RTD Trial Activation] Set masked email', props<{ maskedEmail: string }>());
