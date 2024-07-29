import { AbstractControl, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Component, ElementRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { SxmUiNameOnCardFormFieldComponent } from '../name-on-card-form-field/name-on-card-form-field.component';
import { FormGroupControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { SxmUiCreditCardNumberFormFieldComponent } from '../credit-card-number-form-field/credit-card-number-form-field.component';
import { SxmValidators } from '@de-care/shared/forms-validation';

export interface CreditCardFormFieldsComponentApi {
    clearForm: () => void;
    setFocus: () => void;
    nameOnCard: AbstractControl;
}

@Component({
    selector: 'sxm-ui-credit-card-form-fields',
    templateUrl: './credit-card-form-fields.component.html',
    styleUrls: ['./credit-card-form-fields.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiCreditCardFormFieldsComponent,
            multi: true,
        },
    ],
})
export class SxmUiCreditCardFormFieldsComponent extends FormGroupControlValueAccessorConnector implements OnInit, CreditCardFormFieldsComponentApi {
    get nameOnCard() {
        return this.formGroup?.controls?.nameOnCard;
    }

    constructor(injector: Injector, private readonly _sxmValidators: SxmValidators) {
        super(injector);
    }

    @Input() initialState = null;
    @Input() nameOnCardAsHiddenInput = false;
    @ViewChild(SxmUiNameOnCardFormFieldComponent) private readonly _creditCardName: ElementRef;
    @ViewChild(SxmUiCreditCardNumberFormFieldComponent) private readonly _creditCardNumber: ElementRef;
    translateKeyPrefix = 'SharedSxmUiUiCreditCardFormFieldsModule.SxmUiCreditCardFormFieldsComponent.';

    ngOnInit() {
        if (this.formGroup) {
            this.formGroup.addControl('nameOnCard', new FormControl('', { validators: [this._sxmValidators.creditCardName], updateOn: 'blur' }));
            this.formGroup.addControl(
                'cardNumber',
                new FormControl('', {
                    validators: [this._sxmValidators.creditCardNumber],
                    updateOn: 'blur',
                })
            );
            this.formGroup.addControl(
                'expirationDate',
                new FormControl('', {
                    validators: [this._sxmValidators.creditCardExpiredDate],
                    updateOn: 'blur',
                })
            );
            this.formGroup.addControl(
                'cvv',
                new FormControl('', {
                    validators: [this._sxmValidators.cvvBasedOnCardNumberControl(this.formGroup.get('cardNumber'))],
                    updateOn: 'blur',
                })
            );
        }
        if (this.initialState) {
            const { nameOnCard, cardNumber, cardExpirationDate: expirationDate, cvv } = this.initialState;
            if (nameOnCard) {
                this.formGroup.get('nameOnCard')?.patchValue(nameOnCard, { emitEvent: false });
            }
            if (cardNumber) {
                this.formGroup.get('cardNumber')?.patchValue(cardNumber, { emitEvent: false });
            }
            if (expirationDate) {
                this.formGroup.get('expirationDate')?.patchValue(expirationDate, { emitEvent: false });
            }
            if (cvv) {
                this.formGroup.get('cvv')?.patchValue(cvv, { emitEvent: false });
            }
        }
    }

    setFocus() {
        if (this._creditCardNumber && this._creditCardNumber.nativeElement) {
            this._creditCardNumber.nativeElement.select();
            this._creditCardNumber.nativeElement.focus();
            this._creditCardNumber.nativeElement.scrollIntoView({ block: 'center' });
        }
    }

    clearForm() {
        this.formGroup.reset();
    }
}
