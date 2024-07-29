import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as uuid from 'uuid/v4';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';

@Component({
    selector: 'sxm-ui-text-input-with-tooltip-form-field',
    templateUrl: './text-input-with-tooltip-form-field.component.html',
    styleUrls: ['./text-input-with-tooltip-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: TextInputWithTooltipFormFieldComponent,
            multi: true,
        },
    ],
})
export class TextInputWithTooltipFormFieldComponent extends ControlValueAccessorConnector {
    @Input() labelText = '';
    @Input() errorText: string;
    @Input() tooltipAriaLabelText = '';
    @Input() tooltipIconOnly = false;
    @Output() tooltipClicked = new EventEmitter();
    controlId = uuid();
    @Input() dataFieldType = '';

    constructor(injector: Injector) {
        super(injector);
    }
}
