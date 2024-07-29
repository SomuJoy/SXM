import { CommonModule } from '@angular/common';
import { Component, HostBinding, HostListener, Injector, Input, NgModule, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { SharedSxmUiUiIconCheckmarkModule } from '@de-care/shared/sxm-ui/ui-icon-checkmark';
import * as uuid from 'uuid/v4';

export interface RadioOptionData {
    label: string;
    value: unknown;
}

@Component({
    selector: 'sxm-ui-radio-option-card-with-icon-and-radio-select-form-field',
    templateUrl: './radio-option-card-with-icon-and-radio-select-form-field.component.html',
    styleUrls: ['./radio-option-card-with-icon-and-radio-select-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiRadioOptionCardWithIconAndRadioSelectFormFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiRadioOptionCardWithIconAndRadioSelectFormFieldComponent extends ControlValueAccessorConnector implements OnChanges {
    controlId: string;
    @Input() data: RadioOptionData = { label: '', value: undefined };
    @HostBinding('attr.aria-label') ariaLabel = this.data?.label;
    @HostBinding('class.selected') get isSelected() {
        return this.control?.value === this.data?.value;
    }
    @HostListener('click') onClick() {
        this.control.patchValue(this.data.value);
    }

    constructor(injector: Injector) {
        super(injector);
        this.controlId = `option-${uuid()}`;
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        if (simpleChanges.data) {
            this.ariaLabel = this.data.label;
        }
    }
}

@NgModule({
    declarations: [SxmUiRadioOptionCardWithIconAndRadioSelectFormFieldComponent],
    exports: [SxmUiRadioOptionCardWithIconAndRadioSelectFormFieldComponent],
    imports: [CommonModule, ReactiveFormsModule, SharedSxmUiUiIconCheckmarkModule],
})
export class SxmUiRadioOptionCardWithIconAndRadioSelectFormFieldComponentModule {}
