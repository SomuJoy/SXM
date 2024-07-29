import { PlanTypeEnum, SubscriptionStatusType, SubscriptionStreamingServiceStatus } from './types';

export interface SubscriptionModel {
    subscriptionId: string;
    id: string;
    followonPlans?: Array<PlanModel>;
    plans: Array<PlanModel>;
    streamingService?: SubscriptionStreamingService;
    radioService: RadioModel;
    status?: SubscriptionStatusType;
    devicePromoCode?: string;
    nickname?: string;
    hasDuplicateVehicleInfo?: boolean;
}

export interface SubscriptionStreamingService {
    id?: string;
    maskedUserName: string;
    status: SubscriptionStreamingServiceStatus;
}

export interface PlanModel {
    code: string;
    descriptor?: string;
    packageName: string;
    termLength: number;
    startDate?: string;
    endDate: string;
    nextCycleOn?: string;
    type: PlanTypeEnum;
    closedDevices?: RadioModel[];
    name?: string;
    description?: PackageDescriptionModel;
    marketType?: string;
    dataCapable?: boolean;
}

export interface RadioModel {
    id?: string;
    last4DigitsOfRadioId: string;
    radioId?: string;
    nickName?: string;
    endDate?: number;
    deviceStatus?: string;
    vehicleInfo: VehicleModel;
    is360LCapable?: boolean;
}

export interface VehicleModel {
    readonly id?: number | string;
    year: string | number;
    make: string;
    model: string;
    vin?: string;
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
