import { Pipe, PipeTransform } from '@angular/core';

export interface VehicleModel {
    readonly id?: number | string;
    year: string | number;
    make: string;
    model: string;
    vin?: string;
}

@Pipe({
    name: 'vehicleInfoTranslate',
})
export class VehicleInfoTranslatePipe implements PipeTransform {
    transform(vehicleInfo: VehicleModel, args: { defaultText: string; isFrench?: boolean }): string {
        return vehicleInfo?.make || vehicleInfo?.model || vehicleInfo?.year ? this._getVehicleString(vehicleInfo, args?.isFrench) : args.defaultText;
    }

    private _getVehicleString(vehicleInfo: VehicleModel, isFrench: boolean = false) {
        return isFrench ? this._getFrenchVersion(vehicleInfo) : this._getEnglishVersion(vehicleInfo);
    }

    private _getEnglishVersion(vehicleInfo: VehicleModel) {
        return [vehicleInfo.year || '', vehicleInfo.make || '', vehicleInfo.model || ''].join(' ');
    }

    private _getFrenchVersion(vehicleInfo: VehicleModel) {
        return [vehicleInfo.make || '', vehicleInfo.model || '', vehicleInfo.year || ''].join(' ');
    }
}
