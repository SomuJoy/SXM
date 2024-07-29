import { Component, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'sxm-ui-password-form-field',
    templateUrl: './password-form-field.component.html',
    styleUrls: ['./password-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: PasswordFormFieldComponent,
            multi: true,
        },
    ],
})
export class PasswordFormFieldComponent extends ControlValueAccessorConnector {
    translateKeyPrefix = 'sharedSxmUiUiPasswordFormFieldModule.PasswordFormFieldComponent.';
    controlId = uuid();
    @Input() errorMsg: string;
    @Input() labelText: string;
    inputIsFocused = false;

    constructor(injector: Injector) {
        super(injector);
    }
}
