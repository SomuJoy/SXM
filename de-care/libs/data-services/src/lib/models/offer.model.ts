import { QuoteModel } from './quote.model';
import { PlanTypeEnum } from '../enums/plan-type.enum';
import { OfferNotAvailableReasonEnum } from '../enums/offer-not-available-reason.enum';

export interface OfferModel {
    readonly id?: number | string;
    offers: Array<PackageModel>;
}

export interface OfferRenewalRequestModel {
    radioId: string;
    planCode?: string;
    renewalCode?: string;
    streaming: boolean;
}

export interface OfferRequestModel {
    programCode?: string;
    marketingPromoCode?: string;
    streaming?: boolean;
    province?: string;
    student?: boolean;
}

export interface BasePackageModel {
    planCode: string;
    packageName: string;
    termLength: number;
    price: number;
    pricePerMonth?: number;
    processingFee?: number;
    type?: PlanTypeEnum;
    retailPrice: number;
    promoCode?: string;
    deal?: OfferDealModel;
    fallback: boolean;
    priceChangeMessagingType?: string;
    streaming?: boolean;
    marketType?: string;
    planEndDate?: string;
    mrdEligible?: boolean;
    msrpPrice?: number;
    fallbackReason?: OfferNotAvailableReasonEnum;
    supportedServices?: string[];
    minimumFollowOnTerm?: number;
    packageUpgrade?: string;
    packageUpgradePrice?: number;
    student?: boolean;
    parentPackageName?: string;
    advantage?: boolean;
}

export interface PackageModel extends BasePackageModel {
    code: string;
    name?: string;
    description?: PackageDescriptionModel;
    quote?: QuoteModel;
    isStreaming?: boolean;
}

export interface PackageDescriptionModel {
    name: string;
    company: string;
    packageName: string;
    channelLineUpURL?: string;
    header: string;
    footer: string;
    promoFooter: string;
    description: string;
    channels: Array<ChannelModel>;
    linkWithSiteSupported?: boolean;
}

export interface ChannelModel {
    title: string;
    descriptions: Array<string>;
    count: string;
}

export interface OfferCustomerDataModel {
    accountNumber?: string;
    radioId?: string;
    programCode?: string;
    marketingPromoCode?: string;
    province?: string;
    usedCarBrandingType?: string;
    streaming?: boolean;
    subscriptionId?: string;
    student?: boolean;
}

export type Locales = 'en_CA' | 'en_US' | 'fr_CA';

export interface OfferPckgDescDataModel {
    packageNames: Array<string>;
}

export interface OfferDealModel {
    type: string;
    etfAmount: number;
    etfTerm: number;
    channels: Array<ChannelModel>;
    description: string;
    header: string;
    name: string;
    packageName: string;
    promoFooter: string;
}

export interface OfferDetailsModel {
    type?: string;
    processingFee?: number;
    msrpPrice?: number;
    name?: string;
    offerTotal?: number;
    offerTerm?: number;
    offerMonthlyRate?: number;
    savingsPercent?: number;
    retailRate?: number;
    etf?: number;
    etfTerm?: number;
    isStreaming?: boolean;
    priceChangeMessagingType?: string;
    deal?: OfferDealModel;
    isMCP?: boolean;
    isLongTerm?: boolean;
    offerType?: string;
    followOnTermLength?: number;
    followOnPrice?: number;
    packageUpgrade?: string;
    packageUpgradePrice?: number;
    marketType?: string;
    isStudentOffer?: boolean;
    isAdvantage?: boolean;
    price?: number;
    promoCode?: string;
}

export interface OfferDetailsRTCModel {
    renewalPackages: {
        packageName: string;
        pricePerMonth: number;
        msrpPrice: number;
        mrdEligible: boolean;
        parentPackageName?: string;
    }[];
    selectedPackage: string;
}

export interface OfferNotAvailableModel {
    offerNotAvailable: boolean;
    offerNotAvailableReason: OfferNotAvailableReasonEnum;
    offerNotAvailableAccepted?: boolean;
}
