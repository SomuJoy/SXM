import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VehicleModel } from '@de-care/data-services';
import * as uuid from 'uuid/v4';

// TODO: Update this interface to remove unused fields
export interface ConfirmVinInputData {
    vinNumber: string;
    state: string;
    licensePlate: string;
    last4DigitsOfRadioId: string;
    vehicleInfo?: VehicleModel;
}

@Component({
    selector: 'confirm-vin',
    templateUrl: './confirm-vin.component.html',
    styleUrls: ['./confirm-vin.component.scss']
})
export class ConfirmVinComponent {
    @Input() data: ConfirmVinInputData;
    @Input() last4DigitsOfRadioId: string;
    @Input() ariaDescribedbyTextId = uuid();
    @Output() vinConfirmed = new EventEmitter();
    @Output() tryAgainEvent = new EventEmitter();
}
