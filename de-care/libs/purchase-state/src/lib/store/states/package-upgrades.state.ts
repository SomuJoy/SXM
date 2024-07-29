import { OfferDealModel } from '@de-care/data-services';

export interface PackageChannels {
    title: string;
    descriptions: Array<any>;
}

export interface PackageInfo {
    advantage: boolean;
    streaming: boolean;
    packageName: string;
    planCode: string;
    price: number;
    retailPrice: number;
    termLength: number;
    type?: string;
    pricePerMonth: number;
    processingFee: number;
    upsellType: string;
    marketType: string;
    header: string;
    expired: boolean;
    name: string;
    description: string;
    channels: Array<PackageChannels>;
    deal: OfferDealModel;
    footer: string;
    promoFooter: string;
    priceChangeMessagingType?: string;
    minimumFollowOnTerm?: number;
}

export interface PackageUpgrades {
    plan: string;
    loading: boolean;
    upgrade: Array<PackageInfo>;
}

export const initialPackageUpgradesState: PackageUpgrades = {
    plan: null,
    loading: false,
    upgrade: null
};
