import { createAction, props } from '@ngrx/store';
import { Account, Subscription, ClosedDeviceModel } from '../data-services/account.interface';
import { StreamingEligibilityServiceResponse } from '../data-services/streaming-eligibility.service';

// TODO: determine if we need a load account action or if that will need to be handled in a workflow chain

export const setAccount = createAction('[Account] Set account', props<{ account: Account }>());
export const setAccountPartial = createAction('[Account] Set account', props<{ account: any }>());
export const loadAccountError = createAction('[Account] Load account error', props<{ error: any }>());
export const setIsUserNameInTokenSameAsAccount = createAction(
    '[Account] Set account is username in token same as account',
    props<{ isUserNameInTokenSameAsAccount: boolean }>()
);
export const setPrefillEmail = createAction('[Account] Set account email', props<{ email: string }>());
export const setSelectedSubscriptionId = createAction('[Account] Set account selected subscription id', props<{ selectedSubscriptionId: number }>());
export const setMarketingAccountId = createAction('[Account] Set marketing account id', props<{ marketingAccountId: string }>());
export const setEmailId = createAction('[Account] Set email id', props<{ email: string }>());

export const setIsTokenizedLink = createAction('[Account] Set Is Tokenized Link', props<{ isTokenizedLink: boolean }>());

export const setIsEligibleForRegistration = createAction(
    '[Account] set isEligibleForRegistration',
    props<{ isEligibleForRegistration: boolean; requiresCredentials: boolean }>()
);

export const setSecondarySubscriptions = createAction(
    '[Account] Set secondary Subscriptions',
    props<{
        secondarySubscriptions: {
            status: string;
            id?: string;
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
    }>()
);

export const setSecondaryStreamingSubscriptions = createAction(
    '[Account] Set secondary Streaming Subscriptions',
    props<{
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
    }>()
);
export const setSCEligibleSubscriptions = createAction('[Account] Set SC eligible subscriptions', props<{ sCEligibleSubscriptions: Subscription[] }>());
export const setSCEligibleClosedDevices = createAction('[Account] Set SC eligible closed devices', props<{ sCEligibleClosedDevices: ClosedDeviceModel[] }>());
export const setSPEligibleSelfPaySubscriptionIds = createAction(
    '[Account] Set SP eligible self pay subscription IDs',
    props<{ sPEligibleSelfPaySubscriptionIds: string[] }>()
);
export const setSPEligibleClosedRadioIds = createAction('[Account] Set SP eligible closed radio ids', props<{ sPEligibleClosedRadioIds: string[] }>());
export const registerNonPiiResponseIsNullForAccountNumber = createAction('[Account] Register Non Pii Response Is Null For Account Number');
export const registerNonPiiResponseIsNullForRadioId = createAction('[Account] Register Non Pii Response Is Null For Radio Id');
export const resetAccountStateToInitial = createAction('[Account] Reset Account State to Initial');

export const patchSubscriptionWithStreamingEligibilityById = createAction(
    '[Account] Patch subscription with streaming eligibility by ID',
    props<{
        subscriptionId: string | number;
        streamingEligibility: StreamingEligibilityServiceResponse;
    }>()
);

export const setMaskedUserNameFromToken = createAction('[Account] Set masked username from token', props<{ maskedUserNameFromToken: string }>());
// legacy subscriptions non-pii calls need to set domain state. remove as legacy calls are updated to use domain workflow
export const setSubscriptionsFromLegacyOneStepActivation = createAction(
    '[Account] set subscription ID from legacy one step activation',
    props<{ subscriptions: Subscription[] }>()
);

export const patchNicknameBySubscriptionId = createAction(
    '[Account] Patch nickname by subscriptionID',
    props<{
        subscriptionId: string | number;
        nickname: string;
    }>()
);

export const patchRemoveClosedDeviceByRadioId = createAction(
    '[Account] Patch remove closed device by radioID',
    props<{
        radioId: string | number;
    }>()
);

export const patchAccountUsername = createAction('[Account] patch account username', props<{ userName: string }>());

export const patchPrimarySubscriptionUsername = createAction('[Account] patch primary subscription username', props<{ userName: string }>());

export const patchContactInfo = createAction(
    '[Account] Set Contact Info',
    props<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        billingAddressSameAsService: boolean;
        serviceAddress: {
            streetAddress: string;
            city: string;
            state: string;
            postalCode: string;
        };
    }>()
);

export const patchBillingSummaryEbill = createAction('[Account] Set Billing Summary Ebill', props<{ isEBill: boolean }>());

export const patchBillingAddress = createAction(
    '[Account] Patch Billing Address',
    props<{
        billingAddress: {
            addressLine1: string;
            addressLine2?: string;
            city: string;
            state: string;
            zipCode: string;
        };
    }>()
);
