import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormField } from '../base-form-field.directive';

@Component({
    selector: 'sxm-ui-credit-card-number-form-field',
    template: `
        <div class="input-container" aria-live="polite" [class.invalid]="control.invalid && control.touched" [class.filled]="!!control.value" [class.active]="inputIsFocused">
            <label data-test="sxmUICreditCardNumber.label" data-e2e="sxmUICreditCardNumber.label" for="cc-number">{{
                placeholderText || translateKeyPrefix + 'PLACEHOLDER' | translate
            }}</label>
            <input
                sxmUiCreditCardType
                sxmUiCreditCardFormat
                id="cc-number"
                name="cc-number"
                autocomplete="cc-number"
                type="text"
                maxlength="19"
                [formControl]="control"
                data-test="sxmUICreditCardNumber"
                data-e2e="sxmUICreditCardNumber"
                (focus)="inputIsFocused = true"
                (blur)="inputIsFocused = false"
            />
            <mat-icon svgIcon="cc-amex" aria-hidden="false" [attr.aria-label]="translateKeyPrefix + 'CC_AMEX_ARIA_LABEL' | translate"></mat-icon>
            <mat-icon svgIcon="cc-dci" aria-hidden="false" [attr.aria-label]="translateKeyPrefix + 'CC_DCI_ARIA_LABEL' | translate"></mat-icon>
            <mat-icon svgIcon="cc-discover" aria-hidden="false" [attr.aria-label]="translateKeyPrefix + 'CC_DISCOVER_ARIA_LABEL' | translate"></mat-icon>
            <mat-icon svgIcon="cc-jcb" aria-hidden="false" [attr.aria-label]="translateKeyPrefix + 'CC_JCB_ARIA_LABEL' | translate"></mat-icon>
            <mat-icon svgIcon="cc-mc" aria-hidden="false" [attr.aria-label]="translateKeyPrefix + 'CC_MC_ARIA_LABEL' | translate"></mat-icon>
            <mat-icon svgIcon="cc-visa" aria-hidden="false" [attr.aria-label]="translateKeyPrefix + 'CC_VISA_ARIA_LABEL' | translate"></mat-icon>
            <mat-icon svgIcon="cc-unionpay" aria-hidden="false" [attr.aria-label]="translateKeyPrefix + 'CC_UNIONPAY_ARIA_LABEL' | translate"></mat-icon>
            <mat-icon svgIcon="lock" aria-hidden="false" [attr.aria-label]="translateKeyPrefix + 'LOCK_ICON_ARIA_LABEL' | translate"></mat-icon>
        </div>
        <div *ngIf="control.invalid && control.touched" class="invalid-feedback">
            <p>{{ errorMessage || translateKeyPrefix + 'ERROR_REQUIRED' | translate }}</p>
        </div>
    `,
    styleUrls: ['./credit-card-number-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiCreditCardNumberFormFieldComponent,
            multi: true,
        },
    ],
})
export class SxmUiCreditCardNumberFormFieldComponent extends BaseFormField {
    translateKeyPrefix = 'SharedSxmUiUiCreditCardFormFieldsModule.SxmUiCreditCardNumberFormFieldComponent.';
}
