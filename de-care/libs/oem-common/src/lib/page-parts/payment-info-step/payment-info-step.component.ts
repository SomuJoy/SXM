import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormControl, Validators } from '@angular/forms';
import { controlIsInvalid, getSxmValidator, buildCvvLengthValidator } from '@de-care/shared/validation';
import { PaymentInfoService } from './payment-info.service';
import { PaymentInfo } from '../../data-models/payment-info';

@Component({
    selector: 'payment-info-step',
    templateUrl: './payment-info-step.component.html',
    styleUrls: ['./payment-info-step.component.scss'],
    providers: [PaymentInfoService]
})
export class PaymentInfoStepComponent implements OnInit {
    submitting = false;
    paymentForm: FormGroup;
    @Input() submitPaymentInfoError = false;
    @Input() includeCvvField = false;
    @Output() completed = new EventEmitter<PaymentInfo>();
    submitted = false;
    hideMaskedCCNumber = true;
    maskedNum: string;
    isGiftCardEntered = false;

    date = new Date();
    todaysDate = {
        month: this.date.getMonth() + 1,
        year: this.date.getFullYear()
    };

    readonly minimumYear = this.todaysDate.year;

    constructor(private _formBuilder: FormBuilder, private _paymentInfoService: PaymentInfoService) {}

    controlIsInvalid: (control: AbstractControl) => boolean = controlIsInvalid(() => {
        return this.submitted;
    });

    checkGiftCardHandler($event) {
        this.isGiftCardEntered = $event.isGiftCard;
    }

    ccExpValidator = (paymentInfoForm: FormGroup) => {
        if (paymentInfoForm.get('ccExpirationMonth').invalid || paymentInfoForm.get('ccExpirationYear').invalid) {
            return null;
        }

        const inputMonth = +paymentInfoForm.get('ccExpirationMonth').value;
        const inputYear = +paymentInfoForm.get('ccExpirationYear').value;

        if (
            (inputYear && inputMonth && inputYear < this.todaysDate.year) ||
            (inputYear && inputMonth && inputYear === this.todaysDate.year && inputMonth < this.todaysDate.month) ||
            inputMonth === 0
        ) {
            return { invalidDate: true };
        }
        return null;
    };

    ngOnInit() {
        this.paymentForm = this._formBuilder.group(
            {
                ccName: ['', { validators: getSxmValidator('creditCardName'), updateOn: 'blur' }],
                ccNum: ['', { updateOn: 'blur' }],
                ccExpirationMonth: ['', { validators: [Validators.required, Validators.min(1), Validators.max(12)], updateOn: 'blur' }],
                ccExpirationYear: ['', { validators: [Validators.required, Validators.min(this.minimumYear)], updateOn: 'blur' }]
            },
            { validator: this.ccExpValidator }
        );

        if (this.includeCvvField) {
            this.paymentForm.addControl(
                'ccCVV',
                new FormControl('', { validators: [...getSxmValidator('creditCardSecurityCode'), buildCvvLengthValidator(this.paymentForm.get('ccNum'))], updateOn: 'blur' })
            );
        }
    }

    paymentFormSubmit() {
        this.submitting = true;
        this.paymentForm.markAllAsTouched();
        if (this.paymentForm.invalid || this.isGiftCardEntered) {
            this.paymentForm.controls.ccNum.updateValueAndValidity();
            this.submitting = false;
        } else {
            this._paymentInfoService.isValidCreditCardNumber(this.paymentForm.value.ccNum).subscribe(isValid => {
                if (isValid) {
                    this.setMaskedCCNumber();
                    this.completed.emit({
                        nameOnCard: this.paymentForm.value.ccName,
                        cardNumber: this.paymentForm.value.ccNum,
                        expiryMonth: this.paymentForm.value.ccExpirationMonth,
                        expiryYear: this.paymentForm.value.ccExpirationYear,
                        securityCode: this.includeCvvField ? this.paymentForm.value.ccCVV : null
                    });
                } else {
                    this.paymentForm.get('ccNum').setErrors({ invalidCCNum: true });
                }
                this.submitting = false;
            });
        }
    }

    setMaskedCCNumber() {
        const currentCCNumber = this.paymentForm.get('ccNum').value.substr(-4);

        this.maskedNum = `************${currentCCNumber}`;
        this.hideMaskedCCNumber = false;
    }

    unmaskCCNum() {
        this.hideMaskedCCNumber = true;
        this.paymentForm.get('ccNum').reset();
    }
}
