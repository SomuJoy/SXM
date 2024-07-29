import { Component, Output, EventEmitter, Input } from '@angular/core';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'vin-error',
    templateUrl: './vin-error.component.html',
    styleUrls: ['./vin-error.component.scss']
})
export class VinErrorComponent {
    @Output() radioIdSearchClick = new EventEmitter();
    @Input() ariaDescribedbyTextId = uuid();
}
