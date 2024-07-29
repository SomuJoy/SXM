import { OfferNotAvailableReasonEnum } from '@de-care/data-services';
import { Action, createReducer, on } from '@ngrx/store';
import { RTDAccountInfo } from '../models/account-info-models';
import { NewAccountResults } from '../models/new-account-results.interfaces';
import { RTDPaymentInfo } from '../models/payment-info-models';
import {
    clearPaymentInfo,
    setAccountInfo,
    setLangPref,
    setPaymentInfo,
    setProgramCode,
    setPromoCode,
    setOfferNotAvailable,
    setShowFollowOn,
    setNewAccountResults,
    setLoadYourInfoDataAsProcessing,
    setLoadYourInfoDataAsNotProcessing,
    setDisplayNuCaptcha,
    setMaskedEmail
} from './actions';

export const featureKey = 'rtdTrialActivationSharedFeature';

export interface RollToDropTrialActivationSharedState {
    paymentInfo: RTDPaymentInfo;
    accountInfo: RTDAccountInfo;
    promoCode: string;
    programCode: string;
    langPref: string;
    offerNotAvailableReason: OfferNotAvailableReasonEnum;
    showFollowOnSelection: boolean;
    newAccountResults: NewAccountResults;
    loadYourInfoDataIsProcessing: boolean;
    displayNucaptcha: boolean;
    maskedEmail: string;
}

export const initialState: RollToDropTrialActivationSharedState = {
    paymentInfo: null,
    accountInfo: null,
    promoCode: null,
    programCode: null,
    langPref: null,
    offerNotAvailableReason: null,
    showFollowOnSelection: true,
    newAccountResults: null,
    loadYourInfoDataIsProcessing: false,
    displayNucaptcha: false,
    maskedEmail: null
};

const rollToDropTrialActivationSharedReducer = createReducer(
    initialState,
    on(setAccountInfo, (state, { accountInfo }) => ({ ...state, accountInfo })),
    on(setPaymentInfo, (state, { paymentInfo }) => ({ ...state, paymentInfo })),
    on(clearPaymentInfo, state => ({ ...state, paymentInfo: null })),
    on(setPromoCode, (state, { promoCode }) => ({ ...state, promoCode })),
    on(setProgramCode, (state, { programCode }) => ({ ...state, programCode })),
    on(setLangPref, (state, { langPref }) => ({ ...state, langPref })),
    on(setOfferNotAvailable, (state, { offerNotAvailableReason }) => ({ ...state, offerNotAvailableReason: offerNotAvailableReason as OfferNotAvailableReasonEnum })),
    on(setShowFollowOn, (state, { showFollowOnSelection }) => ({ ...state, showFollowOnSelection })),
    on(setNewAccountResults, (state, { subscriptionId, isOfferStreamingEligible, isEligibleForRegistration, email }) => ({
        ...state,
        newAccountResults: { subscriptionId, isOfferStreamingEligible, isEligibleForRegistration, email }
    })),
    on(setLoadYourInfoDataAsProcessing, state => ({ ...state, loadYourInfoDataIsProcessing: true })),
    on(setLoadYourInfoDataAsNotProcessing, state => ({ ...state, loadYourInfoDataIsProcessing: false })),
    on(setDisplayNuCaptcha, state => ({ ...state, displayNucaptcha: true })),
    on(setMaskedEmail, (state, { maskedEmail }) => ({ ...state, maskedEmail }))
);

export function reducer(state: RollToDropTrialActivationSharedState, action: Action) {
    return rollToDropTrialActivationSharedReducer(state, action);
}
