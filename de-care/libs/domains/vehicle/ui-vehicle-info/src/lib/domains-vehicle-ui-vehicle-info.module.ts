import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VehicleInfoTranslatePipe } from './vehicle-info-translate.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [VehicleInfoTranslatePipe],
    exports: [VehicleInfoTranslatePipe]
})
export class DomainsVehicleUiVehicleInfoModule {}
