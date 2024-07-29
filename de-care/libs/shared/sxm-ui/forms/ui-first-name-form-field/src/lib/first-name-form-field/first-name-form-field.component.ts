import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'sxm-ui-first-name-form-field',
    template: `
        <div class="input-container" [class.invalid]="control.invalid && control.touched" [class.filled]="!!control.value" [class.active]="inputIsFocused">
            <label for="{{ controlId }}">{{ placeholderText || translateKeyPrefix + 'PLACEHOLDER' | translate }}</label>
            <input
                [formControl]="control"
                type="text"
                id="{{ controlId }}"
                name="given-name"
                autocomplete="given-name"
                maxlength="50"
                data-e2e="firstNameFormField"
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
            useExisting: SxmUiFirstNameFormFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiFirstNameFormFieldComponent extends ControlValueAccessorConnector {
    @Input() placeholderText: string;
    @Input() errorMessage: string;
    controlId = uuid();
    inputIsFocused = false;
    translateKeyPrefix = 'SharedSxmUiFormsUiFirstNameFormFieldModule.SxmUiFirstNameFormFieldComponent.';
}
