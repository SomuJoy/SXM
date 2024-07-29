import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'vehicleInfoOrRadio',
    pure: false,
})
export class VehicleInfoOrRadioPipe implements PipeTransform {
    protected readonly _translatePipe: TranslatePipe;

    constructor(private readonly _translateService: TranslateService, changeDetectorRef: ChangeDetectorRef) {
        this._translatePipe = new TranslatePipe(this._translateService, changeDetectorRef);
    }

    transform(
        deviceInfo: {
            vehicleInfo: {
                year: string | number;
                make: string;
                model: string;
            };
            radioId: string;
        },
        translateKeyVehicle: string,
        translateKeyRadio: string
    ) {
        if (deviceInfo?.vehicleInfo) {
            return this._translatePipe.transform(translateKeyVehicle, { ...deviceInfo.vehicleInfo });
        } else {
            return this._translatePipe.transform(translateKeyRadio, { radioId: deviceInfo.radioId });
        }
    }
}
