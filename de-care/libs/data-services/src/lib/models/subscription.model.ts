import { PlanModel } from './plan.model';
import { RadioModel } from './radio.model';

export type SubscriptionStatusType = 'Active' | 'Closed';

export enum SubscriptionStatusEnum {
    'ACTIVE' = 'Active',
    'CLOSED' = 'Closed',
}

export interface SubscriptionModel {
    subscriptionId: string;
    id: string;
    followonPlans?: Array<PlanModel>;
    plans: Array<PlanModel>;
    streamingService?: SubscriptionStreamingService;
    radioService: RadioModel;
    status?: SubscriptionStatusType;
    devicePromoCode?: string;
}

export type SubscriptionStreamingServiceStatus = 'Active';

export interface SubscriptionStreamingService {
    id?: string;
    maskedUserName: string;
    status: SubscriptionStreamingServiceStatus;
}
