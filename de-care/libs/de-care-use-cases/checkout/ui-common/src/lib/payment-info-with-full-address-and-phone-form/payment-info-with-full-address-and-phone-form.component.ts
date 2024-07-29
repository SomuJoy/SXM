import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
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
import { map } from 'rxjs/operators';
import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { CheckoutValidateAddressWorkflowService } from '@de-care/de-care-use-cases/checkout/state-common';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-phone-number-form-field';
import { SharedSxmUiUiModalModule, SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { DomainsCustomerUiVerifyAddressModule } from '@de-care/domains/customer/ui-verify-address';

export interface PaymentInfoWithFullAddressAndPhoneComponentApi {
    setProcessingCompleted(): void;
    showCreditCardSubmissionError(): void;
    clearCreditCardSubmissionError(): void;
}

export interface PaymentInfoWithFullAddressAndPhoneData {
    useCardOnFile: boolean;
    paymentInfo: {
        nameOnCard: string;
        cardNumber: string;
        expirationDate: string;
        cvv: string;
        giftCard: string;
        addressLine1: string;
        city: string;
        state: string;
        zip: string;
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
    selector: 'de-care-payment-info-with-full-address-and-phone-form',
    templateUrl: './payment-info-with-full-address-and-phone-form.component.html',
    styleUrls: ['./payment-info-with-full-address-and-phone-form.component.scss'],
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
        SharedSxmUiUiAddressFormFieldsModule,
        SharedSxmUiUiPhoneNumberFormFieldModule,
        SharedSxmUiUiModalModule,
        DomainsCustomerUiVerifyAddressModule,
    ],
})
export class PaymentInfoWithFullAddressAndPhoneComponent implements ComponentWithLocale, PaymentInfoWithFullAddressAndPhoneComponentApi, OnInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    initialStatePaymentInfo = null;
    country = 'US';
    @ViewChild(SxmUiCreditCardFormFieldsComponent) private readonly _creditCardFormFieldsComponent: CreditCardFormFieldsComponentApi;
    @ViewChild('verifyAddressModal') private readonly _verifyAddressModal: SxmUiModalComponent;

    paymentForm = this._formBuilder.group({
        paymentMethod: new FormControl('NEW_CARD', Validators.required),
        serviceAddress: new FormControl({}),
        creditCardInfo: new FormGroup({}),
        phoneNumber: new FormControl(null, { validators: this._sxmValidators.phoneNumber, updateOn: 'blur' }),
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
    @Output() formCompleted = new EventEmitter<PaymentInfoWithFullAddressAndPhoneData>();

    useCardOnFileAllowed = false;
    cardType: string;
    cardNumberLastFour: string;
    paymentFormSubmitted = false;
    paymentFormProcessing$ = new BehaviorSubject(false);
    paymentMethodSelectionError$ = new BehaviorSubject(false);
    invalidZipFromLookupError$ = new BehaviorSubject(false);
    creditCardSubmissionError$ = new BehaviorSubject(false);
    private readonly _addressSuggestionsViewModel$ = new BehaviorSubject<{ correctedAddresses: any[]; addressCorrectionAction: any }>({
        correctedAddresses: [],
        addressCorrectionAction: null,
    });
    verifyAddressesDataViewModel$: Observable<{
        headingText: any;
        currentAddress: {};
        correctedAddresses: any[];
        addressCorrectionAction: any;
    }>;
    private _skipAddressValidationOnSuggestionAccept = false;

    constructor(
        private readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private readonly _sxmValidators: SxmValidators,
        private readonly _checkoutValidateAddressWorkflowService: CheckoutValidateAddressWorkflowService
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.verifyAddressesDataViewModel$ = combineLatest([
            this._addressSuggestionsViewModel$,
            this.translationsForComponentService.stream(`${this.translateKeyPrefix}.CONFIRM_YOUR_ADDRESS`),
        ]).pipe(
            map(([viewModel, headingText]) => ({
                ...viewModel,
                headingText,
                currentAddress: { ...this.paymentForm.controls.serviceAddress.value },
            }))
        );
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
                    const { paymentInfo } = this._formDataAsPaymentInfo();
                    this._checkoutValidateAddressWorkflowService.build({ paymentInfo, skipAddressValidation: this._skipAddressValidationOnSuggestionAccept }).subscribe({
                        next: (result) => {
                            if (result?.correctedAddress) {
                                const { avsValidated, ...address } = result.correctedAddress;
                                this._updateAddress(address);
                            }

                            const { creditCardInfo, paymentMethod, serviceAddress, ...paymentInfo } = this.paymentForm?.value;
                            //TODO: credit card form should be initialized in this parent component instead
                            const combinedPaymentInfo = { ...paymentInfo, ...creditCardInfo, ...serviceAddress } as any;
                            this.formCompleted.next({ useCardOnFile: false, paymentInfo: combinedPaymentInfo });
                        },
                        error: (error) => {
                            switch (error?.status) {
                                case 'ADDRESS_CONFIRMATION_NEEDED': {
                                    this._skipAddressValidationOnSuggestionAccept = !error.validated;
                                    this._addressSuggestionsViewModel$.next({
                                        correctedAddresses: error.correctedAddresses,
                                        addressCorrectionAction: error.addressCorrectionAction,
                                    });
                                    this._verifyAddressModal.open();
                                }
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

    onEditExistingAddress() {
        this._skipAddressValidationOnSuggestionAccept = false;
        this._verifyAddressModal.close();
    }

    onUseAddressFromValidation(correctedAddress) {
        this._updateAddress(correctedAddress);
        this._skipAddressValidationOnSuggestionAccept = true;
        this.submitPaymentInfo();
        this._verifyAddressModal.close();
    }

    private _updateAddress(address) {
        this.paymentForm.get('serviceAddress').patchValue({ ...address }, { emitEvent: false });
    }

    private _formDataAsPaymentInfo(avsValidated = false): any {
        const { creditCardInfo, paymentMethod, serviceAddress, ...paymentInfo } = this.paymentForm?.value;
        return { paymentInfo: { ...paymentInfo, ...creditCardInfo, ...serviceAddress, avsValidated }, useCardOnFile: false };
    }
}
