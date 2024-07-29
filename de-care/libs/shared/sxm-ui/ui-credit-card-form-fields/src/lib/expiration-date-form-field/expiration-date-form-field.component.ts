import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormField } from '../base-form-field.directive';

@Component({
    selector: 'sxm-ui-expiration-date-form-field',
    template: `
        <div class="input-container" [class.invalid]="control.invalid && control.touched" [class.filled]="!!control.value" [class.active]="inputIsFocused">
            <label for="cc-exp">{{ placeholderText || translateKeyPrefix + 'PLACEHOLDER' | translate }}</label>
            <input
                [formControl]="control"
                sxmUiMaskExpirationDate
                type="text"
                id="cc-exp"
                name="cc-exp"
                autocomplete="cc-exp"
                minlength="5"
                maxlength="5"
                data-test="creditCardFormFields.ccExpirationDate"
                data-e2e="creditCardFormFields.ccExpirationDate"
                (blur)="inputIsFocused = false"
                (focus)="inputIsFocused = true"
            />
        </div>
        <div *ngIf="control.invalid && control.touched" class="invalid-feedback">
            <p>{{ errorMessage || translateKeyPrefix + 'ERROR_REQUIRED' | translate }}</p>
        </div>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiExpirationDateFormFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiExpirationDateFormFieldComponent extends BaseFormField {
    translateKeyPrefix = 'SharedSxmUiUiCreditCardFormFieldsModule.SxmUiExpirationDateFormFieldComponent.';
}
