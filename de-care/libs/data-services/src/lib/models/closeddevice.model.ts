import { VehicleModel } from './vehicle.model';
import { SubscriptionModel } from './subscription.model';

export interface ClosedDeviceModel {
    last4DigitsOfRadioId: string;
    closedDate: string;
    vehicleInfo: VehicleModel;
    subscription: SubscriptionModel;
    devicePromoCode?: string;
}
