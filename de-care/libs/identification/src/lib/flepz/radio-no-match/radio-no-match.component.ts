import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AccountVerify, VehicleModel } from '@de-care/data-services';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'radio-no-match',
    templateUrl: './radio-no-match.component.html',
    styleUrls: ['./radio-no-match.component.scss']
})
export class RadioNoMatchComponent implements OnInit {

    @Input() last4DigitsOfRadioId: string;
    @Input() vehicleInfo: VehicleModel;
    @Input() userVerifyData: AccountVerify;
    @Input() ariaDescribedbyTextId = uuid();
    @Output() editInfo = new EventEmitter();
    @Output() createNewAccount = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    edit($event: MouseEvent) {
        $event.preventDefault();
        this.editInfo.emit();
    }
}