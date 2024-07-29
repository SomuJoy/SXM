import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { CreditCardFormFieldsComponentApi, SxmUiCreditCardFormFieldsComponent } from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import { SxmUiNucaptchaComponent } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { ValidateNucaptchaWorkflowService } from '@de-care/domains/utility/state-nucaptcha';
import { AddedGiftCardData } from '@de-care/domains/payment/ui-prepaid-redeem';

export interface PaymentInfoBasiWithQuotesFormComponentApi {
    setProcessingCompleted(): void;
    showCreditCardSubmissionError(): void;
    clearCreditCardSubmissionError(): void;
}

export interface PaymentInfoBasicWithQuotesLegacyExtraData {
    isBothRadios?: boolean;
    isPlatinumVIP?: boolean;
    showTotalAsPaid?: boolean;
    isUpgradePkg?: boolean;
    isAnnual?: boolean;
    isAcsc?: boolean;
    isFlepz?: boolean;
}

export interface PaymentInfoBasicWithQuotesData {
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
    selector: 'de-care-payment-info-basic-with-quotes-form',
    templateUrl: './payment-info-basic-with-quotes-form.component.html',
    styleUrls: ['./payment-info-basic-with-quotes-form.component.scss'],
})
export class PaymentInfoBasicWithQuotesComponent implements ComponentWithLocale, PaymentInfoBasiWithQuotesFormComponentApi {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    initialStatePaymentInfo = null;
    country = 'US';
    @Input() quoteViewModel;
    @Input() shouldIncludeNuCaptcha = false;
    @Input() showUnusedCreditLine = false;
    @Input() useQuotesAlternateHeader = false;
    // TODO: refactor this to be more specific at the quote-summary component level as to what it is doing
    @Input() legacySettings: { isStreamingFlow: boolean; isNewAccount: boolean } = { isStreamingFlow: false, isNewAccount: false };
    @Input() extraData: PaymentInfoBasicWithQuotesLegacyExtraData;
    @ViewChild(SxmUiCreditCardFormFieldsComponent) private readonly _creditCardFormFieldsComponent: CreditCardFormFieldsComponentApi;
    @ViewChild('nuCaptchaComponent') private readonly _nuCaptchaComponent: SxmUiNucaptchaComponent;
    @Input() isQuebecProvince;
    @Input() useRateVersionOfTextCopy;

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
    @Output() paymentFormInfoSubmitted = new EventEmitter<PaymentInfoBasicWithQuotesData>();
    @Output() formCompleted = new EventEmitter<void>();

    captchaAnswerWrong$ = new BehaviorSubject(false);
    useCardOnFileAllowed = false;
    cardType: string;
    cardNumberLastFour: string;
    paymentFormSubmitted = false;
    formProcessing$ = new BehaviorSubject(false);
    paymentMethodSelectionError$ = new BehaviorSubject(false);
    creditCardSubmissionError$ = new BehaviorSubject(false);
    transactionForm = this._formBuilder.group({
        chargeAgreementAccepted: [false, { validators: [Validators.requiredTrue] }],
        nuCaptchaAnswer: null,
    });
    newCard = this._formBuilder.group({
        creditCardInfo: new UntypedFormGroup({}),
        country: new UntypedFormControl('US', this._sxmValidators.countryCode),
        giftCard: new UntypedFormControl(null),
    });
    paymentForm = this._formBuilder.group({
        paymentMethod: new UntypedFormControl('NEW_CARD', Validators.required),
        newCard: this.newCard,
    });

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _formBuilder: UntypedFormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private readonly _sxmValidators: SxmValidators,
        private readonly _translateService: TranslateService,
        private readonly _validateNuCaptchaWorkflowService: ValidateNucaptchaWorkflowService
    ) {
        translationsForComponentService.init(this);
    }

    setProcessingCompleted(): void {
        this.formProcessing$.next(false);
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
        this.formProcessing$.next(true);
        this.paymentFormSubmitted = true;
        this.paymentMethodSelectionError$.next(false);
        this.creditCardSubmissionError$.next(false);
        if (this.paymentForm.controls.paymentMethod.invalid) {
            this.paymentMethodSelectionError$.next(true);
            this.formProcessing$.next(false);
        } else {
            if (this.paymentForm.value.paymentMethod === 'CARD_ON_FILE') {
                this.paymentFormInfoSubmitted.next({ useCardOnFile: true, paymentInfo: null });
            } else {
                this.newCard.markAllAsTouched();
                if (this.newCard.valid) {
                    const { creditCardInfo, ...paymentInfo } = this.paymentForm?.value?.newCard;
                    this.paymentFormInfoSubmitted.next({ useCardOnFile: false, paymentInfo: { ...paymentInfo, ...creditCardInfo } });
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
                    this.formProcessing$.next(false);
                }
            }
        }
    }

    submitTransaction() {
        this.transactionForm.markAllAsTouched();
        this.formProcessing$.next(true);
        if (this.transactionForm.valid) {
            if (this.shouldIncludeNuCaptcha && this._nuCaptchaComponent) {
                this._validateNuCaptchaWorkflowService
                    .build({ answer: this.transactionForm.value.nuCaptchaAnswer.answer, token: this._nuCaptchaComponent?.getCaptchaToken() })
                    .subscribe({
                        next: (valid) => {
                            if (valid) {
                                this.formCompleted.next();
                            } else {
                                this.captchaAnswerWrong$.next(true);
                            }
                        },
                        error: () => {
                            // TODO: display system error
                            this.formProcessing$.next(false);
                        },
                    });
            } else {
                this.formCompleted.next();
            }
        } else {
            const errors = [];
            // TODO: add client side validation errors here
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this.formProcessing$.next(false);
        }
    }
}
