type ServiceType = 'ESN' | 'SIR' | 'UNIVERSAL_LOGIN';

type FallbackOfferReason =
    | 'Expired offer'
    | 'Trial radio is not eligible for this offer'
    | 'Invalid program/marketing promo code'
    | 'Radio or subscription is ineligible for this offer'
    | 'Offer not available'
    | 'Missing program code';

interface Deal {
    type: string;
    etfAmount?: number;
    etfTerm?: number;
    isPartnerBundle: boolean;
}

export interface OfferModel {
    planCode: string;
    packageName: string;
    packageUpgrade?: string;
    promoCode?: string;
    termLength?: number;
    type?: string;
    marketType?: string;
    price?: number;
    pricePerMonth?: number;
    retailPrice?: number;
    packageUpgradePrice?: number;
    msrpPrice?: number;
    processingFee?: number;
    supportServices: ServiceType[];
    deal?: Deal;
    priceChangeMessageType?: string;
    planEndDate?: string;
    minimumFollowOnTerm?: number;
    order?: number;
    bundledSavingPrice?: number;
    bundleSubPackageNames?: string[];
    parentPackageName: string;
    fallbackReason: FallbackOfferReason;
    capability: string[];
    mrdEligible: boolean;
    invoiceEligible: boolean;
    advantage: boolean;
    student: boolean;
    fallback: boolean;
    streaming: boolean;
    upgradeOffer: boolean;
    bestPackage: boolean;
    leadOffer: boolean;
    dataCapable: boolean;
    bundled?: boolean;
}
