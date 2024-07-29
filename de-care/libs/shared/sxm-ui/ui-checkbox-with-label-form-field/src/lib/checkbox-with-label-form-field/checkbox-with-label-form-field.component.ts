import { ChangeDetectionStrategy, Component, HostBinding, Injector } from '@angular/core';
import * as uuid from 'uuid/v4';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'sxm-ui-checkbox-with-label-form-field',
    templateUrl: './checkbox-with-label-form-field.component.html',
    styleUrls: ['./checkbox-with-label-form-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: CheckboxWithLabelFormFieldComponent,
            multi: true
        }
    ]
})
export class CheckboxWithLabelFormFieldComponent extends ControlValueAccessorConnector {
    @HostBinding('class.checkbox-item') checkboxItemClass = true;
    controlId: string;

    constructor(injector: Injector) {
        super(injector);
        this.controlId = `checkbox_${uuid()}`;
    }
}
