import { ChangeDetectionStrategy, Component, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'sxm-ui-radio-option-with-tooltip-form-field',
    templateUrl: './radio-option-with-tooltip-form-field.component.html',
    styleUrls: ['./radio-option-with-tooltip-form-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: RadioOptionWithTooltipFormFieldComponent,
            multi: true
        }
    ]
})
export class RadioOptionWithTooltipFormFieldComponent extends ControlValueAccessorConnector {
    @Input() label: string;
    @Input() value: any;
    @Input() alternateStyle: boolean = false;

    controlId: string;

    constructor(injector: Injector) {
        super(injector);
        this.controlId = `radioOption_${uuid()}`;
    }
}
