import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormField } from '../base-form-field.directive';

@Component({
    selector: 'sxm-ui-cvv-form-field',
    template: `
        <div class="input-container" [class.invalid]="control.invalid && control.touched" [class.filled]="!!control.value" [class.active]="inputIsFocused">
            <label data-test="sxmUICvvFormField.label" for="cc-csc">{{ placeholderText || translateKeyPrefix + 'PLACEHOLDER' | translate }}</label>
            <input
                #cvvInput
                [formControl]="control"
                type="password"
                id="cc-csc"
                name="cc-csc"
                minlength="3"
                maxlength="4"
                autocomplete="cc-csc"
                data-test="sxmUICvvFormField"
                data-e2e="sxmUICvvFormField"
                (focus)="inputIsFocused = true"
                (blur)="inputIsFocused = false"
            />
        </div>
        <sxm-ui-tooltip #tooltip [class.active]="tooltip.opened" [class.invalid]="control.invalid && control.touched" sxmUiDataClickTrack="modal">
            <p>{{ translateKeyPrefix + 'TOOLTIP_MESSAGE_1' | translate }}</p>
            <p>{{ translateKeyPrefix + 'TOOLTIP_MESSAGE_2' | translate }}</p>
        </sxm-ui-tooltip>
        <div *ngIf="control.invalid && control.touched" class="invalid-feedback">
            <p>{{ errorMessage || translateKeyPrefix + 'ERROR_REQUIRED' | translate }}</p>
        </div>
    `,
    styleUrls: ['./cvv-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiCvvFormFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiCvvFormFieldComponent extends BaseFormField {
    translateKeyPrefix = 'SharedSxmUiUiCreditCardFormFieldsModule.SxmUiCvvFormFieldComponent.';
}
