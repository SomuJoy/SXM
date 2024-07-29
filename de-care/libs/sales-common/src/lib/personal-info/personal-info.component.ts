import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { VehicleModel } from '@de-care/data-services';

@Component({
    selector: 'personal-info',
    templateUrl: './personal-info.component.html',
    styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent {
    @Input() vehicleInfo: VehicleModel;
    @Input() radioId: string;
    @Input() addHorizontalLine: boolean = true;
    @Input() isStreaming: boolean = false;
    @Input() maskedUsername: string;
}
