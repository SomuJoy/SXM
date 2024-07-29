import { CommonModule } from '@angular/common';
import { Component, HostBinding, HostListener, Injector, Input, NgModule, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import * as uuid from 'uuid/v4';

// TODO: eventually move this to some utility lib for re-use
function stripHtmlTags(value: string): string {
    return value.replace(/(<([^>]+)>)/gi, '');
}

export interface RadioOptionData {
    title: string;
    description: string;
    value: unknown;
    callout?: {
        text: string;
        imageUrl?: string;
    };
}

@Component({
    selector: 'sxm-ui-radio-option-card-with-radio-select-form-field',
    templateUrl: './radio-option-card-with-radio-select-form-field.component.html',
    styleUrls: ['./radio-option-card-with-radio-select-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiRadioOptionCardWithRadioSelectFormFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiRadioOptionCardWithRadioSelectFormFieldComponent extends ControlValueAccessorConnector implements OnChanges {
    controlId: string;
    optionData?: RadioOptionData;
    @Input() set data(value: RadioOptionData) {
        this.optionData = {
            ...value,
            ...(value?.callout
                ? {
                      callout: {
                          text: stripHtmlTags(value.callout.text),
                          imageUrl: value.callout.imageUrl,
                      },
                  }
                : {}),
        };
    }
    @HostBinding('attr.aria-label') ariaLabel = '';
    @HostBinding('class.selected') get isSelected() {
        return this.control?.value === this.optionData?.value;
    }
    @HostListener('click') onClick() {
        this.control.patchValue(this.optionData.value);
    }

    constructor(injector: Injector) {
        super(injector);
        this.controlId = `option-${uuid()}`;
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        if (simpleChanges.data) {
            if (this.optionData?.title && this.optionData?.description) {
                this.ariaLabel = `${this.optionData.title} ${this.optionData.description}`;
            } else {
                this.ariaLabel = '';
            }
        }
    }
}

@NgModule({
    declarations: [SxmUiRadioOptionCardWithRadioSelectFormFieldComponent],
    exports: [SxmUiRadioOptionCardWithRadioSelectFormFieldComponent],
    imports: [CommonModule, ReactiveFormsModule],
})
export class SxmUiRadioOptionCardWithRadioSelectFormFieldComponentModule {}
