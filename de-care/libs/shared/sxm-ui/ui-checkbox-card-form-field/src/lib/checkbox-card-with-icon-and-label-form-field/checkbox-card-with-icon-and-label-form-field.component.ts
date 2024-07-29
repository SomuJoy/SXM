import { CommonModule } from '@angular/common';
import { Component, HostBinding, HostListener, Injector, Input, NgModule, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { SharedSxmUiUiIconCheckmarkModule } from '@de-care/shared/sxm-ui/ui-icon-checkmark';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'sxm-ui-checkbox-card-with-icon-and-label-form-field',
    templateUrl: './checkbox-card-with-icon-and-label-form-field.component.html',
    styleUrls: ['./checkbox-card-with-icon-and-label-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiCheckboxCardWithIconAndLabelFormFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiCheckboxCardWithIconAndLabelFormFieldComponent extends ControlValueAccessorConnector implements OnChanges {
    controlId: string;
    @Input() label = '';
    @HostBinding('attr.aria-label') ariaLabel = this.label;
    @HostBinding('class.selected') get isSelected() {
        return this.control?.value;
    }
    @HostListener('click') onClick() {
        this.control.setValue(!this.control.value);
    }

    constructor(injector: Injector) {
        super(injector);
        this.controlId = `option-${uuid()}`;
    }

    ngOnChanges(simpleChanges: SimpleChanges): void {
        if (simpleChanges.label) {
            this.ariaLabel = this.label;
        }
    }
}

@NgModule({
    declarations: [SxmUiCheckboxCardWithIconAndLabelFormFieldComponent],
    exports: [SxmUiCheckboxCardWithIconAndLabelFormFieldComponent],
    imports: [CommonModule, ReactiveFormsModule, SharedSxmUiUiIconCheckmarkModule],
})
export class SxmUiCheckboxCardWithIconAndLabelFormFieldComponentModule {}
