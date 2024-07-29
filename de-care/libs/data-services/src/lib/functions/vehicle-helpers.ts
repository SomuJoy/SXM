import { VehicleModel } from '../models/vehicle.model';

export function sanitizeVehicleInfo(vehicleInfo: VehicleModel) {
    if (vehicleInfo) {
        vehicleInfo.make = vehicleInfo.make || '';
        vehicleInfo.model = vehicleInfo.model || '';
        vehicleInfo.year = vehicleInfo.year || '';
    }
}

export function radioOrVinType(radioIdOrVin: string): 'radioId' | 'vin' | '' {
    return /\b.{17}\b/.test(radioIdOrVin) ? 'vin' : /\b.{8,12}\b/.test(radioIdOrVin) ? 'radioId' : '';
}

export function radioLastFour(radio: string): string {
    return radio?.length > 3 ? radio?.slice(radio?.length - 4) : radio;
}
