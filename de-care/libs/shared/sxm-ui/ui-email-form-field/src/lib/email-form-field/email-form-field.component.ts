import { Component, Injector, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';

@Component({
    selector: 'sxm-ui-email-form-field',
    templateUrl: './email-form-field.component.html',
    styleUrls: ['./email-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiEmailFormFieldComponent,
            multi: true
        }
    ]
})
export class SxmUiEmailFormFieldComponent extends ControlValueAccessorConnector implements OnInit {
    @Input() labelText: string;
    @Input() errorMsg: string;
    @Input() qatagName = '';
    @Input() controlId = '';

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {}
}
