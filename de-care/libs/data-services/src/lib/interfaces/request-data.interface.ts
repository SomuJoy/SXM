// ===============================================================================
// Types
import { HttpMethodsType } from '../types/data-services.types';
import { BasePackageModel } from '../models/offer.model';

//********************************************************************************
export interface IRequestData {
    method: HttpMethodsType;
    funcName: string;
    url: string;
    options: any;
}

export interface UpsellRequestData {
    planCode: string;
    radioId?: string;
    streaming?: boolean;
    subscriptionId?: string;
    upsellCode?: string;
    province?: string;
    retrieveFallbackOffer?: boolean;
}

export interface UpsellResponseData {
    offers: UpsellPackageModel[];
}

export interface UpsellPackageModel extends BasePackageModel {
    upsellType: string;
}
