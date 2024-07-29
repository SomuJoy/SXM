import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { VehicleModel } from '@de-care/data-services';

@Component({
    selector: 'de-care-global-personal-info',
    templateUrl: './global-personal-info.component.html',
    styleUrls: ['./global-personal-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalPersonalInfoComponent implements OnInit {
    @Input() vehicleInfo: VehicleModel;
    @Input() last4DigitsRadioId: string;
    @Input() isStreaming: boolean = false;
    @Input() maskedUsername: string;

    constructor() {}

    ngOnInit(): void {}
}
