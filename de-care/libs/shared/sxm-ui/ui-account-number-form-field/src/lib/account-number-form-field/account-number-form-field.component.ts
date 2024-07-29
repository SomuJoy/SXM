import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'sxm-ui-account-number-form-field',
    templateUrl: './account-number-form-field.component.html',
    styleUrls: ['./account-number-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiAccountNumberFormFieldComponent,
            multi: true
        }
    ]
})
export class SxmUiAccountNumberFormFieldComponent extends ControlValueAccessorConnector {
    translateKeyPrefix = 'SharedSxmUiUiAccountNumberFormFieldModule.SxmUiAccountNumberFormFieldComponent.';
    controlId = uuid();
    @Input() errorMsg: string;
    @Input() labelText: string;
    inputIsFocused = false;
}
