export interface UpsellPackageModel {
    upsellType: string;
    planCode: string;
    packageName: string;
    termLength: number;
    price: number;
    pricePerMonth?: number;
    processingFee?: number;
    type: string;
    retailPrice: number;
    promoCode?: string;
    deal?: OfferDealModel;
    fallback: boolean;
    priceChangeMessagingType?: string;
    streaming?: boolean;
    marketType?: string;
    planEndDate?: string;
    mrdEligible: boolean;
    msrpPrice?: number;
    fallbackReason?: string;
    supportedServices?: string[];
    minimumFollowOnTerm?: number;
    packageUpgrade?: string;
    packageUpgradePrice?: number;
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

export interface ChannelModel {
    title: string;
    descriptions: Array<string>;
    count: string;
}
