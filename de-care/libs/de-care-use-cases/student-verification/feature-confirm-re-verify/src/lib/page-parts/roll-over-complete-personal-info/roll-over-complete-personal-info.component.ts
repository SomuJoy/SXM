import { Component, Input } from '@angular/core';

interface VehicleModel {
    readonly id?: number | string;
    year: string | number;
    make: string;
    model: string;
    vin?: string;
}

@Component({
    selector: 'de-care-roll-over-complete-personal-info',
    templateUrl: './roll-over-complete-personal-info.component.html',
    styleUrls: ['./roll-over-complete-personal-info.component.scss'],
})
export class RollOverCompletePersonalInfoComponent {
    @Input() vehicleInfo: VehicleModel;
    @Input() radioId: string;
    @Input() addHorizontalLine = true;
    @Input() isStreaming = false;
    @Input() maskedUsername: string;
}
