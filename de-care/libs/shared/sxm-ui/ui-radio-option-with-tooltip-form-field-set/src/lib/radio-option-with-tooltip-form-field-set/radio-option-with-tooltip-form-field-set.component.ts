import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';

export interface RadioOptionWithTooltipFormFieldSetOption {
    label: string;
    value: string | number | unknown;
    tooltipTitle?: string;
    tooltipText: string[];
}

@Component({
    selector: 'sxm-ui-radio-option-with-tooltip-form-field-set',
    templateUrl: './radio-option-with-tooltip-form-field-set.component.html',
    styleUrls: ['./radio-option-with-tooltip-form-field-set.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: RadioOptionWithTooltipFormFieldSetComponent,
            multi: true
        }
    ]
})
export class RadioOptionWithTooltipFormFieldSetComponent extends ControlValueAccessorConnector {
    @Input() options: RadioOptionWithTooltipFormFieldSetOption[];
}
