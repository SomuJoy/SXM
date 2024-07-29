import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'sxm-ui-radio-id-form-field',
    templateUrl: './radio-id-form-field.component.html',
    styleUrls: ['./radio-id-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiRadioIdFormFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiRadioIdFormFieldComponent extends ControlValueAccessorConnector {
    translateKeyPrefix = 'SharedSxmUiUiRadioidFormFieldModule.SxmUiRadioIdFormFieldComponent.';
    controlId = uuid();
    @Input() errorMsg: string;
    @Input() labelText: string;
    @Input() maskedRadioIdFlag = false;
    inputIsFocused = false;
}
