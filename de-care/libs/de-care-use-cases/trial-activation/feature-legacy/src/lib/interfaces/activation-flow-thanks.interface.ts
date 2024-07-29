import { VehicleModel, PlanModel, RadioModel, SweepstakesModel } from '@de-care/data-services';

export interface ActivationFlowThanksInterface {
    plan: PlanModel;
    vehicleInfo: VehicleModel;
    username: string;
    radioId: string;
    trialEndDate: string;
    newRegistration: boolean;
    ttl?: number;
    isOfferStreamingEligible: boolean;
    email?: string;
    plancode: string;
    accountRegistered: boolean;
    isEligibleForRegistration: boolean;
    subscriptionId?: string;
    plans?: Array<PlanModel>;
    radioService?: Array<RadioModel>;
    sweepstakesInfo?: SweepstakesModel;
}
