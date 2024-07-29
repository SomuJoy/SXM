export interface OfferRenewalRequest {
    planCode: string;
    streaming: boolean;
    radioId?: string;
    renewalCode?: string;
    province?: string;
}

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
}
