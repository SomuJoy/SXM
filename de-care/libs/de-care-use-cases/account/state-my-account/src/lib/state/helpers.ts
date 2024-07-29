import {
    accountPlanTypeIsDemo,
    accountPlanTypeIsPromo,
    accountPlanTypeIsTrial,
    isPlanAlaCarte,
    isPlanAllAccess,
    isPlanAudioCapable,
    isPlanEmployee,
    isPlanMostlyMusic,
    isPlanNextOrForwardBundle,
    isPlanNST,
    isPlanSelect,
    isPlanStreamingME,
    isPlanStreamingPlatinum,
    isPlanVoyager,
} from '@de-care/domains/account/state-account';
import { isPlatinumVip } from '@de-care/domains/offers/state-package-descriptions';

export type OfferDestinationType = 'CHECKOUT' | 'CHECKOUT_TARGETED' | 'TRIAL_EXTENSION' | 'CHANGE' | 'ADD_PVIP_RADIO' | 'SHOP' | 'ACTIVATE' | 'ACTIVE_TRIAL' | 'NONE';
export type OfferProfileType =
    | 'TRIAL'
    | 'TRIAL_NO_BRAND'
    | 'TRIAL_FOLLOWON'
    | 'PROMO_ME_LESS_12'
    | 'PROMO_ME_12_MORE'
    | 'SELFPAY_ME'
    | 'PROMO_FP_PLATINUM'
    | 'PVIP_NO_2ND_RADIO'
    | 'BUNDLE_NO_2ND_RADIO'
    | 'PROMO_MS'
    | 'SELFPAY_MS'
    | 'PROMO_NST'
    | 'SELFPAY_NST'
    | 'SELFPAY_STREAMING_PLATINUM'
    | 'SELFPAY_STREAMING_ME'
    | 'INACTIVE'
    | 'EMPLOYEE'
    | 'DEMO'
    | 'DEFAULT_PLATINUM'
    | 'DEFAULT_FREE_RADIO';

export type DeviceIdentifierType = 'YMM' | 'NICKNAME' | 'DEFAULT';
export type locales = 'en-US' | 'en-CA' | 'fr-CA';

// logic for determining data for offer card
export const getOfferInfoData = (
    planType: string,
    packageName: string,
    planCode: string,
    subscriptionStatus: string,
    devicePromoCode: string,
    isLifetime: boolean,
    hasfollowonPlans: boolean,
    planTermLength: number,
    onlyOnePvip: boolean,
    onlyOnePlatinumBundle: boolean,
    planCapabilities: string[]
) => {
    const offerInfoData: { destination: OfferDestinationType; offerProfile: OfferProfileType; overwriteCopy: boolean } = {
        destination: null,
        offerProfile: null,
        overwriteCopy: true,
    };
    if (isLifetime) {
        offerInfoData.destination = null;
    } else if (!isPlanAudioCapable(planCapabilities)) {
        offerInfoData.destination = 'SHOP';
        offerInfoData.offerProfile = 'DEFAULT_FREE_RADIO';
        offerInfoData.overwriteCopy = true;
    } else if (accountPlanTypeIsTrial(planType)) {
        offerInfoData.destination = 'CHANGE';
        offerInfoData.offerProfile = 'TRIAL_NO_BRAND';
        offerInfoData.overwriteCopy = true;
        if (hasfollowonPlans) {
            offerInfoData.destination = 'SHOP';
            offerInfoData.offerProfile = 'TRIAL_FOLLOWON';
        } else if (devicePromoCode?.startsWith('WB')) {
            offerInfoData.offerProfile = 'TRIAL';
        }
    } else if (subscriptionStatus === 'Inactive') {
        offerInfoData.destination = null;
    } else if (isPlanNextOrForwardBundle(planType) && onlyOnePlatinumBundle) {
        offerInfoData.destination = 'NONE';
        offerInfoData.offerProfile = 'BUNDLE_NO_2ND_RADIO';
        offerInfoData.overwriteCopy = true;
    } else if (isPlatinumVip(packageName) && onlyOnePvip) {
        offerInfoData.destination = 'ADD_PVIP_RADIO';
        offerInfoData.offerProfile = 'PVIP_NO_2ND_RADIO';
        offerInfoData.overwriteCopy = true;
    } else if (accountPlanTypeIsDemo(planType)) {
        offerInfoData.destination = 'SHOP';
        offerInfoData.offerProfile = 'DEMO';
        offerInfoData.overwriteCopy = true;
    } else if (isPlanEmployee(planCode)) {
        offerInfoData.destination = 'SHOP';
        offerInfoData.offerProfile = 'EMPLOYEE';
        offerInfoData.overwriteCopy = true;
    } else if (isPlanAlaCarte(planCode)) {
        offerInfoData.destination = 'CHANGE';
        offerInfoData.offerProfile = 'DEFAULT_PLATINUM';
        offerInfoData.overwriteCopy = true;
    } else if (isPlanVoyager(planCode)) {
        offerInfoData.destination = 'SHOP';
        offerInfoData.offerProfile = 'DEFAULT_FREE_RADIO';
        offerInfoData.overwriteCopy = true;
    } else if (isPlanAllAccess(packageName)) {
        offerInfoData.destination = 'SHOP';
        offerInfoData.offerProfile = 'PROMO_FP_PLATINUM';
        offerInfoData.overwriteCopy = true;
    } else if (isPlanSelect(packageName)) {
        offerInfoData.destination = 'CHANGE';
        offerInfoData.offerProfile = 'SELFPAY_ME';
        offerInfoData.overwriteCopy = true;
        if (accountPlanTypeIsPromo(planType)) {
            offerInfoData.destination = 'SHOP';
            if (planTermLength < 12) {
                offerInfoData.offerProfile = 'PROMO_ME_LESS_12';
            } else {
                offerInfoData.offerProfile = 'PROMO_ME_12_MORE';
            }
        }
    } else if (isPlanMostlyMusic(packageName)) {
        offerInfoData.destination = 'CHANGE';
        offerInfoData.offerProfile = 'SELFPAY_MS';
        offerInfoData.overwriteCopy = true;
        if (accountPlanTypeIsPromo(planType)) {
            offerInfoData.offerProfile = 'PROMO_MS';
        }
    } else if (isPlanNST(packageName)) {
        offerInfoData.destination = 'CHANGE';
        offerInfoData.offerProfile = 'SELFPAY_NST';
        offerInfoData.overwriteCopy = true;
    } else if (isPlanStreamingPlatinum(packageName)) {
        offerInfoData.destination = 'SHOP';
        offerInfoData.offerProfile = 'SELFPAY_STREAMING_PLATINUM';
        offerInfoData.overwriteCopy = true;
    } else if (isPlanStreamingME(packageName)) {
        offerInfoData.destination = 'SHOP';
        offerInfoData.offerProfile = 'SELFPAY_STREAMING_ME';
        offerInfoData.overwriteCopy = true;
    }

    return offerInfoData;
};
