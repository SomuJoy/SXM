import { ChangeDetectionStrategy, Component, Injector, Input } from '@angular/core';
import * as uuid from 'uuid/v4';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'sxm-ui-radio-option-form-field',
    templateUrl: './radio-option-form-field.component.html',
    styleUrls: ['./radio-option-form-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: RadioOptionFormFieldComponent,
            multi: true,
        },
    ],
})
export class RadioOptionFormFieldComponent extends ControlValueAccessorConnector {
    @Input() label: string;
    @Input() description: string;
    @Input() value: any;
    @Input() ariaLabel = '';
    controlId: string;
    labelId: string;

    constructor(injector: Injector) {
        super(injector);
        this.controlId = `radioOption_${uuid()}`;
        this.labelId = `radioOptionLabel_${uuid()}`;
    }
}
