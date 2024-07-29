export interface Offer {
    planCode: string;
    packageName: string;
    promoCode?: any;
    termLength: number;
    type: string;
    marketType: string;
    price: number;
    pricePerMonth: number;
    retailPrice: number;
    msrpPrice: number;
    processingFee?: any;
    supportedServices: string[];
    deal?: any;
    priceChangeMessagingType: string;
    planEndDate?: any;
    fallbackReason?: any;
    minimumFollowOnTerm: number;
    order: number;
    streaming: boolean;
    fallback: boolean;
    mrdEligible: boolean;
    upgradeOffer: boolean;
    parentPackageName?: string;
    name?: string;
    student?: boolean;
    dataCapable?: boolean;
    bundled?: boolean;
    advantage?: boolean;
    bundledSavingPrice?: number;
    customerHasThisPlan?: boolean;
    packageUpgrade?: string;
    packageUpgradePrice?: string;
    bestPackage?: boolean;
    bundleSubPackageNames?: string[];
    leadOffer?: boolean;
}

export interface OfferInfo {
    packageName: string;
    termLength: number;
    pricePerMonth: number;
    retailPrice: number;
    price: number;
    isMCP: boolean;
}

export interface OfferDetailsPickAPlanModel {
    leadOffer?: {
        promoCode?: string;
        msrpPrice?: number;
    };
    packages: {
        packageName: string;
        pricePerMonth: number;
        msrpPrice: number;
        mrdEligible: boolean;
        parentPackageName?: string;
    }[];
    selectedPackage: string;
}
