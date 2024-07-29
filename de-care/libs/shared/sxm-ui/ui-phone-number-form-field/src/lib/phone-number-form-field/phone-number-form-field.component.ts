import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'sxm-ui-phone-number-form-field',
    templateUrl: './phone-number-form-field.component.html',
    styleUrls: ['./phone-number-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiPhoneNumberFormFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiPhoneNumberFormFieldComponent extends ControlValueAccessorConnector {
    translateKeyPrefix = 'SharedSxmUiUiPhoneNumberFormFieldModule.SxmUiPhoneNumberFormFieldComponent.';
    @Input() labelText: string;
    @Input() errorMsg: string;
    @Input() qatagName = '';
    @Input() controlId = uuid();
    inputIsFocused = false;
}
