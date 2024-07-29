import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, Subject, throwError } from 'rxjs';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { TranslateService } from '@ngx-translate/core';
import { ValidatePaymentInfoWorkflowError, ValidatePaymentInfoWorkflowService } from '@de-care/domains/customer/state-customer-verification';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { wireUpCreditCardNameAutofill } from '@de-care/shared/forms/forms-common';
import { CreditCardFormFieldsComponentApi, SxmUiCreditCardFormFieldsComponent } from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { SxmUiNucaptchaComponent } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { ValidateNucaptchaWorkflowService } from '@de-care/domains/utility/state-nucaptcha';
import { AddedGiftCardData } from '@de-care/domains/payment/ui-prepaid-redeem';
import * as uuid from 'uuid/v4';

export interface AccountInfoAndPaymentInfoWithQuotesFormComponentApi {
    setProcessingCompleted(): void;
    showCreditCardSubmissionError(): void;
    clearCreditCardSubmissionError(): void;
    showUnexpectedSubmissionError(): void;
    clearUnexpectedSubmissionError(): void;
    resetFallbackLoadedFields(): void;
}

export interface AccountInfoAndPaymentInfoWithQuotesLegacyExtraData {
    isBothRadios?: boolean;
    isPlatinumVIP?: boolean;
    showTotalAsPaid?: boolean;
    isUpgradePkg?: boolean;
    isAnnual?: boolean;
    isAcsc?: boolean;
    isFlepz?: boolean;
}

export interface AccountInfoAndPaymentInfoWithQuotesData {
    useCardOnFile: boolean;
    paymentInfo: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        addressLine1: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        nameOnCard: string;
        cardNumber: string;
        expirationDate: string;
        cvv: string;
        giftCard: string;
        avsValidated: boolean;
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
    selector: 'de-care-account-info-and-payment-info-with-quotes-form',
    templateUrl: './account-info-and-payment-info-with-quotes-form.component.html',
    styleUrls: ['./account-info-and-payment-info-with-quotes-form.component.scss'],
})
export class AccountInfoAndPaymentInfoWithQuotesFormComponent implements AccountInfoAndPaymentInfoWithQuotesFormComponentApi, AfterViewInit, OnDestroy, ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() set country(value: string) {
        this.paymentForm?.controls?.country?.patchValue(value?.toUpperCase(), { emitEvent: false });
    }
    @Input() initialState: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        address: {
            addressLine1: string;
            city: string;
            state: string;
            zip: string;
        };
        creditCard: { nameOnCard: string; cardNumber: string; expirationDate: string };
    } | null = null;
    @Output() formCompleted = new EventEmitter<AccountInfoAndPaymentInfoWithQuotesData>();
    @Output() zipCodeAddressCollected = new EventEmitter<AccountInfoAndPaymentInfoWithQuotesData>();
    @Input() quoteViewModel;
    @Input() shouldIncludeNuCaptcha = false;
    @Input() showUnusedCreditLine = false;
    @Input() continueButtonTextOverride: string;
    @Input() useQuotesAlternateHeader = false;
    // TODO: refactor this to be more specific at the quote-summary component level as to what it is doing
    @Input() legacySettings: { isStreamingFlow: boolean; isNewAccount: boolean } = { isStreamingFlow: false, isNewAccount: false };
    @Input() extraData: AccountInfoAndPaymentInfoWithQuotesLegacyExtraData;
    transactionForm: FormGroup;
    captchaAnswerWrong$ = new BehaviorSubject(false);
    transactionFormProcessing$ = new BehaviorSubject(false);
    @ViewChild('nuCaptchaComponent') private readonly _nuCaptchaComponent: SxmUiNucaptchaComponent;
    @Input() isQuebecProvince;
    @Input() useRateVersionOfTextCopy;

    paymentForm: FormGroup;
    paymentFormSubmitted = false;
    paymentFormProcessing$ = new BehaviorSubject(false);
    @ViewChild('verifyAddressModal') private readonly _verifyAddressModal: SxmUiModalComponent;
    @ViewChild('creditCardFieldsSection') private readonly _creditCardFieldsSection: ElementRef;
    @ViewChild(SxmUiCreditCardFormFieldsComponent) private readonly _creditCardFormFieldsComponent: CreditCardFormFieldsComponentApi;
    private _skipAddressValidationOnSuggestionAccept = false;
    private _avsValidated = false;
    private readonly _addressSuggestionsViewModel$ = new BehaviorSubject<{ correctedAddresses: any[]; addressCorrectionAction: any }>({
        correctedAddresses: [],
        addressCorrectionAction: null,
    });
    verifyAddressesDataViewModel$: Observable<{
        headingText: any;
        currentAddress: any;
        correctedAddresses: any[];
        addressCorrectionAction: any;
    }>;
    creditCardSubmissionError$ = new BehaviorSubject(false);
    unexpectedSubmissionError$ = new BehaviorSubject(false);
    private destroy$ = new Subject<boolean>();
    accountInfoQuoteModalAriaDescribedbyTextId = uuid();

    constructor(
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _sxmValidators: SxmValidators,
        private readonly _translateService: TranslateService,
        private readonly _validatePaymentInfoWorkflowService: ValidatePaymentInfoWorkflowService,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _validateNuCaptchaWorkflowService: ValidateNucaptchaWorkflowService
    ) {
        translationsForComponentService.init(this);
        this.verifyAddressesDataViewModel$ = combineLatest([
            this._addressSuggestionsViewModel$,
            this._translateService.stream(`${this.translateKeyPrefix}.CONFIRM_YOUR_ADDRESS`),
        ]).pipe(
            map(([viewModel, headingText]) => ({
                ...viewModel,
                headingText,
                currentAddress: { ...this.paymentForm.controls.serviceAddress.value },
            }))
        );
        this.paymentForm = this._formBuilder.group({
            firstName: new FormControl(null, { validators: this._sxmValidators.namePiece, updateOn: 'blur' }),
            lastName: new FormControl(null, { validators: this._sxmValidators.namePiece, updateOn: 'blur' }),
            phoneNumber: new FormControl(null, { validators: this._sxmValidators.phoneNumber, updateOn: 'blur' }),
            serviceAddress: null,
            country: new FormControl('US', this._sxmValidators.countryCode),
            creditCardInfo: new FormGroup({}),
            giftCard: new FormControl(null),
        });

        this.transactionForm = this._formBuilder.group({
            chargeAgreementAccepted: [false, { validators: [Validators.requiredTrue] }],
            nuCaptchaAnswer: null,
        });
    }

    ngAfterViewInit(): void {
        if (this.initialState) {
            const { firstName, lastName, phoneNumber, address, creditCard } = this.initialState;
            this.paymentForm.patchValue({ firstName, lastName, phoneNumber, serviceAddress: address, creditCardInfo: creditCard });
            this._changeDetectorRef.detectChanges();
        }
        wireUpCreditCardNameAutofill(this.paymentForm?.controls?.firstName, this.paymentForm?.controls?.lastName, this._creditCardFormFieldsComponent?.nameOnCard)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    setProcessingCompleted(): void {
        this.paymentFormProcessing$.next(false);
        this._changeDetectorRef.detectChanges();
    }

    showCreditCardSubmissionError(): void {
        this.creditCardSubmissionError$.next(true);
        this._changeDetectorRef.detectChanges();
        scrollToElement(this._creditCardFieldsSection.nativeElement);
    }

    clearCreditCardSubmissionError(): void {
        this.creditCardSubmissionError$.next(false);
        this._changeDetectorRef.detectChanges();
    }

    showUnexpectedSubmissionError(): void {
        this.unexpectedSubmissionError$.next(true);
        this._changeDetectorRef.detectChanges();
        scrollToElement(this._creditCardFieldsSection.nativeElement);
    }

    resetFallbackLoadedFields() {
        this.transactionForm.patchValue({
            chargeAgreementAccepted: false,
        });
        this.transactionFormProcessing$.next(false);
        this.paymentForm.get('creditCardInfo')?.get('cvv')?.setValue(null);
        this._changeDetectorRef.detectChanges();
    }

    clearUnexpectedSubmissionError(): void {
        this.unexpectedSubmissionError$.next(false);
        this._changeDetectorRef.detectChanges();
    }

    onPrepaidCardSubmitted(data: AddedGiftCardData) {
        this.paymentForm.get('giftCard').patchValue(data.pin, { emitEvent: false });
    }

    onPrepaidCardCleared() {
        this.paymentForm.get('giftCard').patchValue(null, { emitEvent: false });
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

    private _formDataAsPaymentInfo() {
        const { creditCardInfo, serviceAddress, ...paymentInfo } = this.paymentForm.value;
        return { paymentInfo: { ...paymentInfo, ...creditCardInfo, ...serviceAddress, avsValidated: this._avsValidated }, useCardOnFile: false };
    }

    submitPaymentInfo() {
        this.paymentForm.markAllAsTouched();
        this.paymentFormProcessing$.next(true);
        this.paymentFormSubmitted = true;
        this.creditCardSubmissionError$.next(false);
        this.unexpectedSubmissionError$.next(false);
        if (this.paymentForm.valid) {
            const { paymentInfo } = this._formDataAsPaymentInfo();
            this._validatePaymentInfoWorkflowService
                .build({ paymentInfo, skipAddressValidation: this._skipAddressValidationOnSuggestionAccept })
                .pipe(
                    tap((result) => {
                        if (result?.correctedAddress) {
                            const { avsValidated, ...address } = result.correctedAddress;
                            this._avsValidated = avsValidated;
                            this._updateAddress(address);
                        }
                    }),
                    catchError((error: ValidatePaymentInfoWorkflowError) => {
                        switch (error?.status) {
                            case 'ADDRESS_CONFIRMATION_NEEDED': {
                                this._skipAddressValidationOnSuggestionAccept = !error.validated;
                                this._addressSuggestionsViewModel$.next({
                                    correctedAddresses: error.correctedAddresses,
                                    addressCorrectionAction: error.addressCorrectionAction,
                                });
                                this._verifyAddressModal.open();
                                return throwError(error.status);
                            }
                        }
                        return throwError(error);
                    })
                )
                .subscribe({
                    next: () => {
                        this.zipCodeAddressCollected.next(this._formDataAsPaymentInfo());
                    },
                    error: () => {
                        // TODO: show system error message
                        this.paymentFormProcessing$.next(false);
                    },
                });
        } else {
            const errors = [];
            if (this.paymentForm.get('firstName').errors) {
                errors.push('Payment - Missing or invalid first name');
            }
            if (this.paymentForm.get('lastName').errors) {
                errors.push('Payment - Missing or invalid last name');
            }
            if (this.paymentForm.get('phoneNumber').errors) {
                errors.push('Payment - Missing or invalid phone number');
            }
            // TODO: add client side errors for address form fields here
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

    submitTransaction() {
        this.transactionForm.markAllAsTouched();
        this.transactionFormProcessing$.next(true);
        if (this.transactionForm.valid) {
            if (this.shouldIncludeNuCaptcha && this._nuCaptchaComponent) {
                this._validateNuCaptchaWorkflowService
                    .build({ answer: this.transactionForm.value.nuCaptchaAnswer.answer, token: this._nuCaptchaComponent?.getCaptchaToken() })
                    .subscribe({
                        next: (valid) => {
                            if (valid) {
                                this.formCompleted.next(this._formDataAsPaymentInfo());
                            } else {
                                this.captchaAnswerWrong$.next(true);
                            }
                        },
                        error: () => {
                            // TODO: display system error
                            this.transactionFormProcessing$.next(false);
                        },
                    });
            } else {
                this.formCompleted.next(this._formDataAsPaymentInfo());
            }
        } else {
            const errors = [];
            // TODO: add client side validation errors here
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this.transactionFormProcessing$.next(false);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}

function scrollToElement(element: ElementRef | Element): void {
    if (element) {
        let node: Element;
        if (element instanceof Element) {
            node = element;
        } else {
            node = element.nativeElement;
        }
        node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
