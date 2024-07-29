import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import * as uuid from 'uuid/v4';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'sxm-ui-postal-code-form-field',
    templateUrl: './postal-code-form-field.component.html',
    styleUrls: ['./postal-code-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiPostalCodeFormFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiPostalCodeFormFieldComponent extends ControlValueAccessorConnector {
    translateKeyPrefix = 'SharedSxmUiUiPostalCodeFormFieldModule.SxmUiPostalCodeFormFieldComponent.';
    controlId = uuid();
    @Input() isCanada = false;
    @Input() errorMsg: string;
    @Input() labelText: string;
    @Output() keyup = new EventEmitter<any>();
    inputIsFocused = false;
}
