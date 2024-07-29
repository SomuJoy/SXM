import { PlanTypeEnum } from '../enums/plan-type.enum';
import { RadioModel } from './radio.model';
import { PackageDescriptionModel } from './offer.model';

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
