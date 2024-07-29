import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { Component, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'sxm-ui-numerical-input-with-tooltip-form-field',
    templateUrl: './numerical-input-with-tooltip-form-field.component.html',
    styleUrls: ['./numerical-input-with-tooltip-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: NumericalInputWithTooltipFormFieldComponent,
            multi: true
        }
    ]
})
export class NumericalInputWithTooltipFormFieldComponent extends ControlValueAccessorConnector {
    @Input() qatagName = '';
    @Input() labelText = '';
    @Input() controlId = '';
    @Input() errorText: string;

    constructor(injector: Injector) {
        super(injector);
    }
}
