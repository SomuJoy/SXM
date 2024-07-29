import { Component, Injector, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'sxm-ui-text-form-field', // tslint:disable-line component-selector
    templateUrl: './text-form-field.component.html',
    styleUrls: ['./text-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiTextFormFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiTextFormFieldComponent extends ControlValueAccessorConnector implements OnInit {
    @Input() qatagName = '';
    @Input() labelText = '';
    @Input() controlId = uuid();
    @Input() errorMsg;
    @Input() minLength: number = 0;
    @Input() maxLength: number = Infinity;
    @Input() dataFieldType = '';
    @Input() dataTest = 'sxmUITextFormField';

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {}
}
