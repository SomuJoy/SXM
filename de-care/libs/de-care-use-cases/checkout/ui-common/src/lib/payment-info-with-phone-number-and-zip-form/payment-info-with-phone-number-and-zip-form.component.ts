import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import {
    CreditCardFormFieldsComponentApi,
    SharedSxmUiUiCreditCardFormFieldsModule,
    SxmUiCreditCardFormFieldsComponent,
} from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { DomainsPaymentUiPrepaidRedeemModule, AddedGiftCardData } from '@de-care/domains/payment/ui-prepaid-redeem';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-phone-number-form-field';
import { SharedSxmUiUiPostalCodeFormFieldModule } from '@de-care/shared/sxm-ui/ui-postal-code-form-field';
import { CustomerValidationAddressesWorkFlowService } from '@de-care/domains/customer/state-customer-verification';
import { map } from 'rxjs/operators';

export interface PaymentInfoWithPhoneNumberAndZipComponentApi {
    setProcessingCompleted(): void;
    showCreditCardSubmissionError(): void;
    clearCreditCardSubmissionError(): void;
}

export interface PaymentInfoWithPhoneNumberAndZipData {
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
        phoneNumber: string;
        zipCode: string;
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
    selector: 'de-care-payment-info-with-phone-number-and-zip-form',
    templateUrl: './payment-info-with-phone-number-and-zip-form.component.html',
    styleUrls: ['./payment-info-with-phone-number-and-zip-form.component.scss'],
    standalone: true,
    imports: [
        SharedSxmUiUiRadioOptionFormFieldModule,
        SharedSxmUiUiProceedButtonModule,
        CommonModule,
        ReactiveFormsModule,
        SharedSxmUiUiPrivacyPolicyModule,
        TranslateModule,
        DomainsPaymentUiPrepaidRedeemModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiCreditCardFormFieldsModule,
        SharedSxmUiUiPhoneNumberFormFieldModule,
        SharedSxmUiUiPostalCodeFormFieldModule,
    ],
})
export class PaymentInfoWithPhoneNumberAndZipComponent implements ComponentWithLocale, PaymentInfoWithPhoneNumberAndZipComponentApi {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    initialStatePaymentInfo = null;
    country = 'US';
    @ViewChild(SxmUiCreditCardFormFieldsComponent) private readonly _creditCardFormFieldsComponent: CreditCardFormFieldsComponentApi;

    paymentForm = this._formBuilder.group({
        paymentMethod: new FormControl('NEW_CARD', Validators.required),
        phoneNumber: new FormControl(null, { validators: this._sxmValidators.phoneNumber, updateOn: 'blur' }),
        zip: new FormControl(null, { validators: this._sxmValidators.postalCode, updateOn: 'blur' }),
        creditCardInfo: new FormGroup({}),
        country: new FormControl('US', this._sxmValidators.countryCode),
        giftCard: new FormControl(null),
    });

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
                this.paymentForm?.get('giftCard').setValue(paymentInfo?.giftCard, { emitEvent: false });
            }
        }
    }
    @Input() continueButtonTextOverride: string;
    @Output() formCompleted = new EventEmitter<PaymentInfoWithPhoneNumberAndZipData>();

    useCardOnFileAllowed = false;
    cardType: string;
    cardNumberLastFour: string;
    paymentFormSubmitted = false;
    paymentFormProcessing$ = new BehaviorSubject(false);
    paymentMethodSelectionError$ = new BehaviorSubject(false);
    invalidZipFromLookupError$ = new BehaviorSubject(false);
    creditCardSubmissionError$ = new BehaviorSubject(false);

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private readonly _sxmValidators: SxmValidators,
        private readonly _customerValidationAddressesWorkFlowService: CustomerValidationAddressesWorkFlowService
    ) {
        translationsForComponentService.init(this);
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
        this.paymentForm?.get('giftCard').patchValue(data.pin, { emitEvent: false });
    }

    onPrepaidCardCleared() {
        this.paymentForm?.get('giftCard').patchValue(null, { emitEvent: false });
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
                this.paymentForm.markAllAsTouched();
                if (this.paymentForm.valid) {
                    this._customerValidationAddressesWorkFlowService
                        .build({ serviceAddress: { zip: this.paymentForm.value.zip } })
                        .pipe(
                            map((result) => {
                                if (!result.serviceAddress.validated) {
                                    throw 'INVALID_ZIP' as string;
                                }
                                return result?.serviceAddress?.correctedAddresses?.[0];
                            })
                        )
                        .subscribe({
                            next: (correctedAddress) => {
                                let cityAndState = {};
                                if (correctedAddress) {
                                    this.paymentForm.get('zip').patchValue(correctedAddress.zip, { emitEvent: false });
                                    cityAndState = {
                                        city: correctedAddress.city,
                                        state: correctedAddress.state,
                                    };
                                }
                                const { creditCardInfo, paymentMethod, ...paymentInfo } = this.paymentForm?.value;
                                //TODO: credit card form should be initialized in this parent component instead
                                const combinedPaymentInfo = { ...paymentInfo, ...creditCardInfo, ...cityAndState } as any;
                                this.formCompleted.next({ useCardOnFile: false, paymentInfo: combinedPaymentInfo });
                            },
                            error: (error) => {
                                if (error === 'INVALID_ZIP') {
                                    this.paymentForm.get('zip').setErrors({ notValid: true });
                                    this.invalidZipFromLookupError$.next(true);
                                }
                                this.paymentFormProcessing$.next(false);
                            },
                        });
                } else {
                    const errors = [];
                    if (this.paymentForm.get('creditCardInfo')?.get('nameOnCard')?.errors) {
                        errors.push('Payment - Missing or invalid name on card');
                    }
                    if (this.paymentForm.get('creditCardInfo')?.get('cardNumber')?.errors) {
                        errors.push('Payment - Missing or invalid credit card number');
                    }
                    if (this.paymentForm.get('creditCardInfo')?.get('expirationDate')?.errors) {
                        errors.push('Payment - Missing or invalid credit card expiration date');
                    }
                    if (this.paymentForm.get('creditCardInfo')?.get('cvv')?.errors) {
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
