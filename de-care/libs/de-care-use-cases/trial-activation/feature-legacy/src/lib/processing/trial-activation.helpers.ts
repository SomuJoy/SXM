import { PackageModel, PlanModel, PurchaseCreateAccountDataModel, TrialSubscriptionAccount, SweepstakesModel } from '@de-care/data-services';
import { AccountData } from '../page-parts/new-account-form-step/new-account-form-step.component';
import { TrialActivationThanksData } from '../trial-activation-thanks.resolver';
import { Plan } from '@de-care/domains/account/state-account';

export const createTrialActivationTokenInfo = (
    offer: PackageModel,
    email: string,
    radioId: string,
    isEligibleForRegistration: boolean,
    isEligibleForStreaming: boolean,
    trialEndDate: string,
    subscriptionId?: string,
    plans?: PlanModel[] | Plan[],
    sweepstakesInfo?: SweepstakesModel
): TrialActivationThanksData => ({
    plans: plans || [
        {
            packageName: offer.packageName,
            endDate: trialEndDate,
            code: offer.planCode,
            descriptor: '',
            termLength: offer.termLength,
            startDate: '',
            nextCycleOn: '',
            closedDevices: [],
            type: offer.type,
        },
    ],
    email,
    deal: offer.deal,
    radioId: radioId,
    trialEndDate: trialEndDate,
    isOfferStreamingEligible: isEligibleForStreaming,
    isEligibleForRegistration: isEligibleForRegistration,
    subscriptionId,
    ...(sweepstakesInfo && { sweepstakesInfo }),
});

export const createNewSubscriptionAccount = (accountData: AccountData, radioId: string, planCode: string, lang: string): PurchaseCreateAccountDataModel => ({
    radioId: radioId,
    plans: [{ planCode }],
    serviceAddress: {
        phone: accountData.phoneNumber,
        avsvalidated: accountData.avsValidated || false,
        streetAddress: accountData.addressLine1,
        city: accountData.city,
        state: accountData.state,
        postalCode: accountData.postalCode,
        country: accountData.country.toUpperCase(),
        firstName: accountData.firstName,
        email: accountData.username,
        lastName: accountData.lastName,
    },
    billingAddress: {
        phone: accountData.phoneNumber,
        avsvalidated: accountData.avsValidated || false,
        streetAddress: accountData.addressLine1,
        city: accountData.city,
        state: accountData.state,
        postalCode: accountData.postalCode,
        country: accountData.country.toUpperCase(),
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        email: accountData.username,
    },
    streamingInfo: {
        login: accountData.username,
        password: accountData.password,
        emailAddress: accountData.username,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
    },
    marketingPromoCode: undefined,
    languagePreference: lang,
});

export const createTrialSubscriptionAccount = (radioId, planCode, login, password): TrialSubscriptionAccount => ({
    radioId,
    plans: [{ planCode }],
    streamingInfo: { login, password },
});
