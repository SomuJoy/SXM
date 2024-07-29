import { Component, Injector, Input } from '@angular/core';
import * as uuid from 'uuid/v4';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'sxm-ui-radio-option-card-with-accordion-form-field',
    templateUrl: './radio-option-card-with-accordion-form-field.component.html',
    styleUrls: ['./radio-option-card-with-accordion-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: RadioOptionCardWithAccordionFormFieldComponent,
            multi: true
        }
    ]
})
export class RadioOptionCardWithAccordionFormFieldComponent extends ControlValueAccessorConnector {
    @Input() label: string;
    @Input() value: any;
    @Input() collapsedText: string;
    @Input() expandedText: string;

    controlId: string;
    constructor(injector: Injector) {
        super(injector);
        this.controlId = `option-${uuid()}`;
    }
}
