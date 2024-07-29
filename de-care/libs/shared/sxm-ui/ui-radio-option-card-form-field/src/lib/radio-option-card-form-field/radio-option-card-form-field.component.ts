import { Component, Injector, Input } from '@angular/core';
import * as uuid from 'uuid/v4';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'sxm-ui-radio-option-card-form-field',
    templateUrl: './radio-option-card-form-field.component.html',
    styleUrls: ['./radio-option-card-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: RadioOptionCardFormFieldComponent,
            multi: true
        }
    ]
})
export class RadioOptionCardFormFieldComponent extends ControlValueAccessorConnector {
    @Input() label: string;
    @Input() value: any;

    controlId: string;
    constructor(injector: Injector) {
        super(injector);
        this.controlId = `option-${uuid()}`;
    }
}
