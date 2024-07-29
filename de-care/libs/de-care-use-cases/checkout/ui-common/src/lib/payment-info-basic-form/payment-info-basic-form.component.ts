import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { CreditCardFormFieldsComponentApi, SxmUiCreditCardFormFieldsComponent } from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import { AddedGiftCardData } from '@de-care/domains/payment/ui-prepaid-redeem';

export interface PaymentInfoBasicFormComponentApi {
    setProcessingCompleted(): void;
    showCreditCardSubmissionError(): void;
    clearCreditCardSubmissionError(): void;
}

export interface PaymentInfoBasicData {
    useCardOnFile: boolean;
    paymentInfo: {
        nameOnCard: string;
        cardNumber: string;
        expirationDate: string;
        cvv: string;
        giftCard: string;
        city: string;
        state: string;
        country: string;
    };
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-payment-info-basic-form',
    templateUrl: './payment-info-basic-form.component.html',
    styleUrls: ['./payment-info-basic-form.component.scss'],
})
export class PaymentInfoBasicFormComponent implements ComponentWithLocale, PaymentInfoBasicFormComponentApi {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    initialStatePaymentInfo = null;
    country = 'US';
    @ViewChild(SxmUiCreditCardFormFieldsComponent) private readonly _creditCardFormFieldsComponent: CreditCardFormFieldsComponentApi;

    @Input() set options(options: { useCardOnFileAllowed: boolean; cardType?: string; cardNumberLastFour?: string; countryCode: string }) {
        this.useCardOnFileAllowed = !!options?.useCardOnFileAllowed;
        this.cardType = options?.cardType;
        this.cardNumberLastFour = options?.cardNumberLastFour;
        if (this.useCardOnFileAllowed) {
            this.paymentForm.patchValue({ paymentMethod: null }, { emitEvent: false });
        }
        if (options.countryCode) {
            this.country = options.countryCode;
            this.paymentForm?.controls?.country?.patchValue(options.countryCode?.toUpperCase(), { emitEvent: false });
        }
    }
    @Input() set initialState(paymentInfo) {
        if (!this.paymentFormSubmitted && paymentInfo && this.paymentForm?.controls) {
            this.initialStatePaymentInfo = paymentInfo;
            if (paymentInfo?.giftCard) {
                this.newCard?.get('giftCard').setValue(paymentInfo?.giftCard, { emitEvent: false });
            }
        }
    }
    @Input() continueButtonTextOverride: string;
    @Output() formCompleted = new EventEmitter<PaymentInfoBasicData>();

    useCardOnFileAllowed = false;
    cardType: string;
    cardNumberLastFour: string;
    paymentForm: FormGroup;
    newCard: FormGroup;
    paymentFormSubmitted = false;
    paymentFormProcessing$ = new BehaviorSubject(false);
    paymentMethodSelectionError$ = new BehaviorSubject(false);
    creditCardSubmissionError$ = new BehaviorSubject(false);

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private readonly _sxmValidators: SxmValidators,
        private readonly _translateService: TranslateService
    ) {
        translationsForComponentService.init(this);
        this.newCard = this._formBuilder.group({
            creditCardInfo: new FormGroup({}),
            country: new FormControl('US', this._sxmValidators.countryCode),
            giftCard: new FormControl(null),
        });
        this.paymentForm = this._formBuilder.group({
            paymentMethod: new FormControl('NEW_CARD', Validators.required),
            newCard: this.newCard,
        });
    }

    setProcessingCompleted(): void {
        this.paymentFormProcessing$.next(false);
    }

    showCreditCardSubmissionError(): void {
        this.creditCardSubmissionError$.next(true);
        this._changeDetectorRef.detectChanges();
    }

    clearCreditCardSubmissionError(): void {
        this.creditCardSubmissionError$.next(false);
    }

    onPrepaidCardSubmitted(data: AddedGiftCardData) {
        this.newCard?.get('giftCard').patchValue(data.pin, { emitEvent: false });
    }

    onPrepaidCardCleared() {
        this.newCard?.get('giftCard').patchValue(null, { emitEvent: false });
    }

    submitPaymentInfo() {
        this.paymentForm.controls.paymentMethod.markAsTouched();
        this.paymentFormProcessing$.next(true);
        this.paymentFormSubmitted = true;
        this.paymentMethodSelectionError$.next(false);
        this.creditCardSubmissionError$.next(false);
        if (this.paymentForm.controls.paymentMethod.invalid) {
            this.paymentMethodSelectionError$.next(true);
            this.paymentFormProcessing$.next(false);
        } else {
            if (this.paymentForm.value.paymentMethod === 'CARD_ON_FILE') {
                this.formCompleted.next({ useCardOnFile: true, paymentInfo: null });
            } else {
                this.newCard.markAllAsTouched();
                if (this.newCard.valid) {
                    const { creditCardInfo, ...paymentInfo } = this.paymentForm?.value?.newCard;
                    this.formCompleted.next({ useCardOnFile: false, paymentInfo: { ...paymentInfo, ...creditCardInfo } });
                } else {
                    const errors = [];
                    if (this.newCard.get('creditCardInfo')?.get('nameOnCard')?.errors) {
                        errors.push('Payment - Missing or invalid name on card');
                    }
                    if (this.newCard.get('creditCardInfo')?.get('cardNumber')?.errors) {
                        errors.push('Payment - Missing or invalid credit card number');
                    }
                    if (this.newCard.get('creditCardInfo')?.get('expirationDate')?.errors) {
                        errors.push('Payment - Missing or invalid credit card expiration date');
                    }
                    if (this.newCard.get('creditCardInfo')?.get('cvv')?.errors) {
                        errors.push('Payment - Missing or invalid credit card cvv code');
                    }
                    if (errors.length > 0) {
                        this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
                    }
                    this.paymentFormProcessing$.next(false);
                }
            }
        }
    }
}
