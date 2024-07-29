import { Pipe, PipeTransform } from '@angular/core';
import { VehicleModel } from '@de-care/data-services';

@Pipe({
    name: 'vehicleInfoTranslate'
})
export class VehicleInfoTranslatePipe implements PipeTransform {
    transform(vehicleInfo: VehicleModel, args: { defaultText: string }): string {
        return vehicleInfo?.make || vehicleInfo?.model || vehicleInfo?.year ? `${[vehicleInfo?.year, vehicleInfo?.make, vehicleInfo?.model].join(' ')}` : args?.defaultText;
    }
}
