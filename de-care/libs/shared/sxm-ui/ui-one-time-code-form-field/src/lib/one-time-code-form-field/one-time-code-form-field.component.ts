import { Component, ElementRef, Injector, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';

@Component({
    selector: 'sxm-ui-one-time-code-form-field',
    templateUrl: './one-time-code-form-field.component.html',
    styleUrls: ['./one-time-code-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiOneTimeCodeFormFieldComponent,
            multi: true
        }
    ]
})
export class SxmUiOneTimeCodeFormFieldComponent extends ControlValueAccessorConnector {
    @Input() qatagName = '';
    @Input() labelText = '';
    @Input() controlId = 'oneTimeCode';
    @Input() errorMsg;
    @Input() minNumber: number;
    @Input() maxNumber: number;
    @Input() maxDigits = Infinity;
    @ViewChild('InputElement') inputElement: ElementRef;

    constructor(injector: Injector) {
        super(injector);
    }
}
