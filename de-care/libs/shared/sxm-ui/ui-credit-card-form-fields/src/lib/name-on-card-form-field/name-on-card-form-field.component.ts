import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormField } from '../base-form-field.directive';

@Component({
    selector: 'sxm-ui-name-on-card-form-field',
    template: `
        <div class="input-container" [class.invalid]="control.invalid && control.touched" [class.filled]="!!control.value" [class.active]="inputIsFocused">
            <label data-test="sxmUINameOnCard.label" data-e2e="sxmUINameOnCard.label" for="{{ controlId }}">{{
                placeholderText || translateKeyPrefix + 'PLACEHOLDER' | translate
            }}</label>
            <input
                [formControl]="control"
                id="{{ controlId }}"
                name="cc-name"
                autocomplete="cc-name"
                type="text"
                minlength="2"
                maxlength="100"
                data-test="sxmUINameOnCard"
                data-e2e="sxmUINameOnCard"
                (focus)="inputIsFocused = true"
                (blur)="inputIsFocused = false"
            />
        </div>
        <div *ngIf="control.invalid && control.touched" class="invalid-feedback">
            <p>{{ errorMessage || translateKeyPrefix + 'ERROR_REQUIRED' | translate }}</p>
        </div>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiNameOnCardFormFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiNameOnCardFormFieldComponent extends BaseFormField {
    translateKeyPrefix = 'SharedSxmUiUiCreditCardFormFieldsModule.SxmUiNameOnCardFormFieldComponent.';
}
