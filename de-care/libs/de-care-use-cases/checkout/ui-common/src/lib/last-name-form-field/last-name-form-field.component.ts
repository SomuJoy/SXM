import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'sxm-ui-last-name-form-field',
    template: `
        <div class="input-container" [class.invalid]="control.invalid && control.touched" [class.filled]="!!control.value" [class.active]="inputIsFocused">
            <label for="{{ controlId }}">{{ placeholderText || translateKeyPrefix + 'PLACEHOLDER' | translate }}</label>
            <input
                [formControl]="control"
                type="text"
                id="{{ controlId }}"
                name="family-name"
                autocomplete="family-name"
                maxlength="50"
                data-e2e="lastNameFormField"
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
            useExisting: SxmUiLastNameFormFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiLastNameFormFieldComponent extends ControlValueAccessorConnector {
    @Input() placeholderText: string;
    @Input() errorMessage: string;
    controlId = uuid();
    inputIsFocused = false;
    translateKeyPrefix = 'DeCareUseCasesCheckoutUiCommonModule.SxmUiLastNameFormFieldComponent.';
}
