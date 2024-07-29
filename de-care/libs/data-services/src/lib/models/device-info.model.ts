import { VehicleModel } from './vehicle.model';

export interface DataDeviceInfoModel {
    deviceInformation: DeviceInfoModel;
}

export interface DeviceInfoModel {
    radioId: string;
    deviceStatus: string;
    primaryBrandId?: string;
    primaryDealerId?: string;
    secondaryBrandId?: string;
    secondaryDealerId?: string;
    vehicle?: VehicleModel;
    service?: string;
    promoCode?: string;
}

export interface DeviceInfoRequestModel {
    radioId: string;
}
