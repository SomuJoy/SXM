import { Offer } from '@de-care/domains/offers/state-offers';
import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
    clearMode,
    setModeToAccountConsolidation,
    setModeToServiceContinuity,
    setRadioIdToReplace,
    setRemoveOldRadioId,
    setSelectedOffer,
    setSelectedPlanCode,
    setLoadQuoteDataAsProcessing,
    setLoadQuoteDataAsNotProcessing,
    setSubmitTransactionAsProcessing,
    setSubmitTransactionAsNotProcessing,
    setPaymentMethodAsNotCardOnFile,
    setPaymentMethodAsCardOnFile,
    setPaymentInfo,
    clearPaymentInfo,
    setTrialRadioAccount,
    setPaymentTypeAsInvoice,
    setPaymentTypeAsCreditCard,
    setUserNameIsSameAsEmail,
    setUserNameIsNotSameAsEmail,
    setShowOffersAsShown,
    setShowOffersAsHidden,
    setTransactionId,
    setProgramCode,
    setMarketingPromoCode,
    setSelfPayRadioAsClosed,
    setSelfPayRadioAsNotClosed,
    setDefaultFlowMode,
    setSelfPayIsPreSelected,
    setSelectedSelfPaySubscriptionIdFromOAC,
    setIsLoggedIn,
    setIsNotLoggedIn,
    setFullTrialRadioId,
    resetFeatureStateToInitial,
    setEligibilityStatus,
    setSelfPayAccountNumberForACOnly,
    setSwapNewRadioService,
    setSelectedSubscriptionIDForSAL,
    setModeToServicePortability,
    setIsRefreshAllowed,
} from './actions';

export enum Mode {
    ServiceContinuity = 'SERVICE_CONTINUITY',
    AccountConsolidation = 'ACCOUNT_CONSOLIDATION',
    ServicePortability = 'SERVICE_PORTABILITY',
}

export enum DefaultMode {
    SC_ONLY = 'SC',
    AC_ONLY = 'AC',
    AC_AND_SC = 'AC_AND_SC',
}

export type EligibilityStatus = 'AC_AND_SC' | 'AC_ONLY' | 'SC_ONLY' | 'TRIAL_ALREADY_CONSOLIDATED_AND_HAS_FOLLOWON' | 'TRIAL_ALREADY_CONSOLIDATED_AND_NO_FOLLOWON' | 'SWAP';

export interface PaymentInfo {
    billingAddress: PaymentAddress;
    serviceAddress?: PaymentAddress;
    ccExpDate: string;
    ccName: string;
    ccNum: string;
    country?: string;
}
export interface PaymentAddress {
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
}

export interface Account {
    mrdCapable: boolean;
    accountNumber: string;
    firstName: string;
    lastName: string;
    phone: string;
    userName: string;
    email: string;
    accountProfile: AccountProfile;
    serviceAddress: Address;
    billingAddress: Address;
    subscriptions: Subscription[];
    billingSummary: BillingSummary;
    consolidatedAccountNumbers: any[];
    closedDevicesMap: any;
    closedDevices: ClosedDeviceModel[];
    hasEmailAddressOnFile?: boolean;
}

export interface AccountProfile {
    profileNumber: string;
    billingStatus: string;
    accountRegistered: boolean;
    createdOnDate: Date;
}

export interface Address {
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isAVSValidated: boolean;
}

export interface Subscription {
    id: string;
    status: string;
    plans: Plan[];
    followonPlans: Plan[];
    radioService: RadioService;
    streamingService: StreamingService;
    isMrdDriving: boolean;
    isPrimary: boolean;
    devicePromoCode?: string;
    isDataOnly?: boolean;
}

export interface Plan {
    code: string;
    packageName: string;
    termLength: number;
    startDate: Date;
    endDate: Date;
    nextCycleOn?: any;
    marketType: string;
    type: string;
    status: string;
    capabilities: string[];
    isChangePlanAllowed: boolean;
    price: number;
    isBasePlan?: boolean;
    dataCapable?: boolean;
    isPreTiering?: boolean;
}

export interface VehicleInfo {
    vin?: string;
    year?: any;
    make?: any;
    model?: any;
}

export interface RadioService {
    id?: string;
    status?: string;
    radioId?: string;
    last4DigitsOfRadioId?: string;
    vehicleInfo?: VehicleInfo;
    capabilities?: string[];
    is360LCapable?: boolean;
}

export interface StreamingService {
    id: string;
    userName: string;
    status: string;
    randomCredentials: boolean;
    maskedUserName?: string;
}

export interface CreditCard {
    last4Digits: string;
    type: string;
    expiryMonth: number;
    expiryYear: number;
    status: string;
}

export interface BillingSummary {
    creditCard: CreditCard;
    isPaymentTypeInvoice: boolean;
}
export interface ClosedDeviceModel {
    last4DigitsOfRadioId: string;
    closedDate: string;
    vehicleInfo: VehicleInfo;
    subscription: Subscription;
    devicePromoCode?: string;
}
export interface ACSCTargetedState {
    mode: Mode | null;
    defaultMode: DefaultMode | null;
    radioIdToReplace: string;
    removeOldRadioId: boolean;
    selectedPlanCode: string;
    selectedOffer: Offer | null;
    useCardOnFile: boolean;
    paymentInfo: PaymentInfo;
    loadQuoteDataAsProcessing: boolean;
    submitTransactionAsProcessing: boolean;
    trialRadioAccount: Account;
    fullTrialRadioId: string;
    paymentType: 'invoice' | 'creditCard';
    transactionId: string;
    isUserNameSameAsEmail: boolean;
    showOffers: boolean;
    programCode: string;
    marketingPromoCode: string;
    isSelfPayRadioClosed: boolean;
    isSelfPayPreSelected: boolean;
    selectedSelfPaySubscriptionIdFromOAC: string;
    isLoggedIn: boolean;
    eligibilityStatus: EligibilityStatus;
    selfPayAccountNumberForACOnly: string;
    swapNewRadioService: RadioService;
    selectedSubscriptionIDForSAL: string;
    isRefreshAllowed?: boolean;
}

const initialState: ACSCTargetedState = {
    mode: null,
    defaultMode: null,
    radioIdToReplace: '',
    removeOldRadioId: false,
    selectedPlanCode: '',
    selectedOffer: null,
    useCardOnFile: false,
    paymentInfo: null,
    loadQuoteDataAsProcessing: false,
    submitTransactionAsProcessing: false,
    trialRadioAccount: null,
    fullTrialRadioId: null,
    paymentType: null,
    transactionId: null,
    isUserNameSameAsEmail: true,
    showOffers: true,
    programCode: null,
    marketingPromoCode: null,
    isSelfPayRadioClosed: false,
    isSelfPayPreSelected: false,
    selectedSelfPaySubscriptionIdFromOAC: null,
    isLoggedIn: false,
    eligibilityStatus: null,
    selfPayAccountNumberForACOnly: null,
    swapNewRadioService: null,
    selectedSubscriptionIDForSAL: null,
    isRefreshAllowed: true,
};

export const featureKey = 'acscTargeted';
export const selectFeatureState = createFeatureSelector<ACSCTargetedState>(featureKey);

const featureReducer = createReducer(
    initialState,
    on(resetFeatureStateToInitial, () => ({ ...initialState })),
    on(setModeToAccountConsolidation, (state) => ({ ...state, mode: Mode.AccountConsolidation })),
    on(setDefaultFlowMode, (state, { defaultMode }) => ({ ...state, defaultMode })),
    on(setModeToServiceContinuity, (state) => ({ ...state, mode: Mode.ServiceContinuity })),
    on(clearMode, (state) => ({ ...state, mode: null })),
    on(setTrialRadioAccount, (state, { trialRadioAccount }) => ({ ...state, trialRadioAccount })),
    on(setFullTrialRadioId, (state, { fullTrialRadioId }) => ({ ...state, fullTrialRadioId })),
    on(setRadioIdToReplace, (state, { radioIdToReplace }) => ({ ...state, radioIdToReplace })),
    on(setRemoveOldRadioId, (state, { removeOldRadioId }) => ({ ...state, removeOldRadioId })),
    on(setSelectedPlanCode, (state, { planCode }) => ({ ...state, selectedPlanCode: planCode })),
    on(setSelectedOffer, (state, { offer }) => ({ ...state, selectedOffer: offer, selectedPlanCode: offer?.planCode })),
    on(setPaymentMethodAsCardOnFile, (state) => ({ ...state, useCardOnFile: true })),
    on(setPaymentMethodAsNotCardOnFile, (state) => ({ ...state, useCardOnFile: false })),
    on(setPaymentInfo, (state, { paymentInfo }) => ({ ...state, paymentInfo })),
    on(clearPaymentInfo, (state) => ({ ...state, paymentInfo: null })),
    on(setPaymentTypeAsCreditCard, (state) => ({ ...state, paymentType: 'creditCard' })),
    on(setPaymentTypeAsInvoice, (state) => ({ ...state, paymentType: 'invoice' })),
    on(setTransactionId, (state, { transactionId }) => ({ ...state, transactionId })),
    on(setLoadQuoteDataAsProcessing, (state) => ({ ...state, loadQuoteDataAsProcessing: true })),
    on(setLoadQuoteDataAsNotProcessing, (state) => ({ ...state, loadQuoteDataAsProcessing: false })),
    on(setSubmitTransactionAsProcessing, (state) => ({ ...state, submitTransactionAsProcessing: true })),
    on(setSubmitTransactionAsNotProcessing, (state) => ({ ...state, submitTransactionAsProcessing: false })),
    on(setUserNameIsSameAsEmail, (state) => ({ ...state, isUserNameSameAsEmail: true })),
    on(setUserNameIsNotSameAsEmail, (state) => ({ ...state, isUserNameSameAsEmail: false })),
    on(setShowOffersAsShown, (state) => ({ ...state, showOffers: true })),
    on(setShowOffersAsHidden, (state) => ({ ...state, showOffers: false })),
    on(setProgramCode, (state, { programCode }) => ({ ...state, programCode })),
    on(setMarketingPromoCode, (state, { marketingPromoCode }) => ({ ...state, marketingPromoCode })),
    on(setSelfPayRadioAsClosed, (state) => ({ ...state, isSelfPayRadioClosed: true })),
    on(setSelfPayRadioAsNotClosed, (state) => ({ ...state, isSelfPayRadioClosed: false })),
    on(setSelfPayIsPreSelected, (state) => ({ ...state, isSelfPayPreSelected: true })),
    on(setSelectedSelfPaySubscriptionIdFromOAC, (state, { subscriptionId }) => ({ ...state, selectedSelfPaySubscriptionIdFromOAC: subscriptionId })),
    on(setIsLoggedIn, (state) => ({ ...state, isLoggedIn: true })),
    on(setIsNotLoggedIn, (state) => ({ ...state, isLoggedIn: false })),
    on(setEligibilityStatus, (state, { eligibilityStatus }) => ({ ...state, eligibilityStatus })),
    on(setSelfPayAccountNumberForACOnly, (state, { selfPayAccountNumberForACOnly }) => ({ ...state, selfPayAccountNumberForACOnly })),
    on(setSwapNewRadioService, (state, { swapNewRadioService }) => ({ ...state, swapNewRadioService })),
    on(setSelectedSubscriptionIDForSAL, (state, { selectedSubscriptionIDForSAL }) => ({ ...state, selectedSubscriptionIDForSAL })),
    on(setModeToServicePortability, (state) => ({ ...state, mode: Mode.ServicePortability })),
    on(setIsRefreshAllowed, (state, { isRefreshAllowed }) => ({ ...state, isRefreshAllowed: isRefreshAllowed }))
);
export function reducer(state: ACSCTargetedState, action: Action) {
    return featureReducer(state, action);
}
