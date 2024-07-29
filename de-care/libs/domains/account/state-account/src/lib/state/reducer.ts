import { Action, createReducer, on } from '@ngrx/store';
import {
    setAccount,
    setIsEligibleForRegistration,
    setMarketingAccountId,
    setPrefillEmail,
    patchAccountUsername,
    setSelectedSubscriptionId,
    setEmailId,
    setSecondarySubscriptions,
    setSCEligibleSubscriptions,
    setSCEligibleClosedDevices,
    resetAccountStateToInitial,
    patchSubscriptionWithStreamingEligibilityById,
    setMaskedUserNameFromToken,
    setAccountPartial,
    setSubscriptionsFromLegacyOneStepActivation,
    setSPEligibleSelfPaySubscriptionIds,
    setSPEligibleClosedRadioIds,
    patchNicknameBySubscriptionId,
    patchRemoveClosedDeviceByRadioId,
    setSecondaryStreamingSubscriptions,
    setIsUserNameInTokenSameAsAccount,
    setIsTokenizedLink,
    patchContactInfo,
    patchBillingAddress,
    patchBillingSummaryEbill,
    patchPrimarySubscriptionUsername,
} from './actions';
import { Account, Subscription, ClosedDeviceModel } from '../data-services/account.interface';

export const featureKey = 'accountFeature';
export interface AccountState {
    account: Account | null;
    isEligibleForRegistration: boolean;
    requiresCredentials: boolean;
    selectedSubscriptionId: number;
    marketingAccountId: string;
    isUserNameInTokenSameAsAccount: boolean;
    secondarySubscriptions: {
        id?: string;
        status: string;
        radioService?: {
            last4DigitsOfRadioId: string;
            vehicleInfo?: {
                year: number;
                make: string;
                model: string;
            };
        };
        plans?: {
            code: string;
            packageName: string;
            termLength: number;
            startDate: string;
            endDate: string;
            nextCycleOn: string;
            marketType: string;
            type: string;
            capabilities: string[];
            price: number;
            isBasePlan: boolean;
            dataCapable: boolean;
        }[];
    }[];
    secondaryStreamingSubscriptions: {
        id: string;
        plans?: {
            code: string;
            label: string;
            packageName: string;
            termLength: number;
            startDate: string;
            endDate: string;
            nextCycleOn: string;
            marketType: string;
            type: string;
            capabilities: string[];
            price: number;
            isBasePlan: boolean;
            dataCapable: boolean;
        }[];
        status: string;
        isPrimary: boolean;
        streamingService: {
            id: string;
            userName: string;
            maskedUserName: string;
            status: string;
            randomCredentials: boolean;
        };
    }[];
    email: string;
    sCEligibleSubscriptions: Subscription[];
    sCEligibleClosedDevices: ClosedDeviceModel[];
    sPEligibleSelfPaySubscriptionIds: string[];
    sPEligibleClosedRadioIds: string[];
    maskedUserNameFromToken?: string;
    isTokenizedLink: boolean;
}
const initialState: AccountState = {
    account: null,
    isEligibleForRegistration: false,
    isUserNameInTokenSameAsAccount: false,
    requiresCredentials: false,
    selectedSubscriptionId: null,
    marketingAccountId: null,
    secondarySubscriptions: [],
    secondaryStreamingSubscriptions: [],
    email: '',
    sCEligibleSubscriptions: [],
    sCEligibleClosedDevices: [],
    sPEligibleSelfPaySubscriptionIds: [],
    sPEligibleClosedRadioIds: [],
    maskedUserNameFromToken: null,
    isTokenizedLink: false,
};

const stateReducer = createReducer(
    initialState,
    on(resetAccountStateToInitial, () => ({ ...initialState })),
    on(setAccount, (state, { account }) => ({
        ...state,
        account: account,
        ...(!state.selectedSubscriptionId && account?.subscriptions[0]?.id && { selectedSubscriptionId: parseInt(account?.subscriptions[0]?.id, 10) }),
    })),
    on(setAccountPartial, (state, { account }) => ({ ...state, account })),
    on(setIsEligibleForRegistration, (state, { isEligibleForRegistration, requiresCredentials }) => ({ ...state, isEligibleForRegistration, requiresCredentials })),
    on(setPrefillEmail, (state, { email }) => ({ ...state, account: { ...state.account, email } })),
    on(setSelectedSubscriptionId, (state, { selectedSubscriptionId }) => ({ ...state, selectedSubscriptionId })),
    on(setMarketingAccountId, (state, { marketingAccountId }) => ({ ...state, marketingAccountId })),
    on(setSecondarySubscriptions, (state, { secondarySubscriptions }) => ({ ...state, secondarySubscriptions })),
    on(setSecondaryStreamingSubscriptions, (state, { secondaryStreamingSubscriptions }) => ({ ...state, secondaryStreamingSubscriptions })),
    on(setEmailId, (state, { email }) => ({ ...state, email })),
    on(setSCEligibleSubscriptions, (state, { sCEligibleSubscriptions }) => ({ ...state, sCEligibleSubscriptions })),
    on(setSCEligibleClosedDevices, (state, { sCEligibleClosedDevices }) => ({ ...state, sCEligibleClosedDevices })),
    on(setSPEligibleSelfPaySubscriptionIds, (state, { sPEligibleSelfPaySubscriptionIds }) => ({ ...state, sPEligibleSelfPaySubscriptionIds })),
    on(setSPEligibleClosedRadioIds, (state, { sPEligibleClosedRadioIds }) => ({ ...state, sPEligibleClosedRadioIds })),
    on(patchSubscriptionWithStreamingEligibilityById, (state, { subscriptionId, streamingEligibility }) => ({
        ...state,
        account: {
            ...state.account,
            subscriptions: [
                ...state.account.subscriptions.map((subscription) => {
                    if (subscription.id === subscriptionId) {
                        return {
                            ...subscription,
                            ...streamingEligibility,
                        };
                    } else {
                        return subscription;
                    }
                }),
            ],
        },
    })),
    on(patchNicknameBySubscriptionId, (state, { subscriptionId, nickname }) => ({
        ...state,
        account: {
            ...state.account,
            subscriptions: [
                ...state.account.subscriptions.map((subscription) => {
                    if (subscription.id === subscriptionId) {
                        return {
                            ...subscription,
                            nickname,
                        };
                    } else {
                        return subscription;
                    }
                }),
            ],
        },
    })),
    on(patchRemoveClosedDeviceByRadioId, (state, { radioId }) => ({
        ...state,
        account: {
            ...state.account,
            closedDevices: [...state.account.closedDevices.filter((closedDevice) => closedDevice.radioId !== radioId)],
        },
    })),
    on(patchBillingSummaryEbill, (state, { isEBill }) => ({
        ...state,
        account: {
            ...state.account,
            billingSummary: {
                ...state.account.billingSummary,
                isEBill: isEBill,
            },
        },
    })),
    on(patchAccountUsername, (state, { userName }) => ({ ...state, account: { ...state.account, userName } })),
    on(patchPrimarySubscriptionUsername, (state, { userName }) => ({
        ...state,
        account: {
            ...state.account,
            subscriptions: [
                ...state.account.subscriptions.map((subscription) => {
                    if (subscription.isPrimary) {
                        return {
                            ...subscription,
                            streamingService: {
                                ...subscription.streamingService,
                                userName,
                            },
                        };
                    } else {
                        return subscription;
                    }
                }),
            ],
        },
    })),
    on(setMaskedUserNameFromToken, (state, { maskedUserNameFromToken }) => ({ ...state, maskedUserNameFromToken })),
    on(setSubscriptionsFromLegacyOneStepActivation, (state, { subscriptions }) => ({
        ...state,
        account: { ...state.account, subscriptions },
    })),
    on(setIsUserNameInTokenSameAsAccount, (state, { isUserNameInTokenSameAsAccount }) => ({ ...state, isUserNameInTokenSameAsAccount })),
    on(setIsTokenizedLink, (state, { isTokenizedLink }) => ({ ...state, isTokenizedLink })),
    on(patchBillingAddress, (state, { billingAddress }) => ({
        ...state,
        account: {
            ...state.account,
            billingAddress: {
                ...state.account.billingAddress,
                streetAddress: billingAddress.addressLine1,
                city: billingAddress.city,
                state: billingAddress.state,
                postalCode: billingAddress.zipCode,
            },
        },
    })),

    on(patchContactInfo, (state, { firstName, lastName, phone, email, billingAddressSameAsService, serviceAddress }) => ({
        ...state,
        account: {
            ...state.account,
            firstName,
            lastName,
            phone,
            email,
            serviceAddress: {
                ...state.account.serviceAddress,
                streetAddress: serviceAddress.streetAddress,
                city: serviceAddress.city,
                state: serviceAddress.state,
                postalCode: serviceAddress.postalCode,
            },
            billingAddress: billingAddressSameAsService
                ? {
                      ...state.account.serviceAddress,
                      streetAddress: serviceAddress.streetAddress,
                      city: serviceAddress.city,
                      state: serviceAddress.state,
                      postalCode: serviceAddress.postalCode,
                  }
                : state.account.billingAddress,
        },
    }))
);

export function reducer(state: AccountState, action: Action) {
    return stateReducer(state, action);
}
