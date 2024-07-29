import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'sxm-ui-last-name-form-field',
    templateUrl: './last-name-form-field.component.html',
    styleUrls: ['./last-name-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: LastNameFormFieldComponent,
            multi: true
        }
    ]
})
export class LastNameFormFieldComponent extends ControlValueAccessorConnector {
    translateKeyPrefix = 'SharedSxmUiUiLastNameFormFieldModule.LastNameFormFieldComponent.';
    controlId = uuid();
    @Input() errorMsg: string;
    @Input() labelText: string;
    inputIsFocused = false;
}
