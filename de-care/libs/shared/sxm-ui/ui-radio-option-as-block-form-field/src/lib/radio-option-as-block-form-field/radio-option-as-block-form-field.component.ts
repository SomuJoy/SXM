import { Component, HostBinding, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as uuid from 'uuid/v4';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';

export interface Label {
    title: string;
    description: string;
}

@Component({
    selector: 'sxm-ui-radio-option-as-block-form-field',
    templateUrl: './radio-option-as-block-form-field.component.html',
    styleUrls: ['./radio-option-as-block-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: RadioOptionAsBlockFormFieldComponent,
            multi: true
        }
    ]
})
export class RadioOptionAsBlockFormFieldComponent extends ControlValueAccessorConnector {
    @Input() labelCopy: Label;
    @Input() value: string;
    @HostBinding('attr.data-e2e') datae2e = 'radioOptionAsBlockFormField';

    controlId: string;

    constructor(injector: Injector) {
        super(injector);
        this.controlId = `Option_${uuid()}`;
    }
}
