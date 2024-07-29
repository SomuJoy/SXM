import { VehicleModel } from './vehicle.model';

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
