import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { CustomerValidationAddressesWorkFlowService } from '@de-care/domains/customer/state-customer-verification';
import { filter, map, takeUntil } from 'rxjs/operators';
import { CreditCardFormFieldsComponentApi, SxmUiCreditCardFormFieldsComponent } from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import { wireUpCreditCardNameAutofill } from '@de-care/shared/forms/forms-common';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { SxmUiNucaptchaComponent } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { ValidateNucaptchaWorkflowService } from '@de-care/domains/utility/state-nucaptcha';
import { AddedGiftCardData } from '@de-care/domains/payment/ui-prepaid-redeem';

export interface AccountInfoBasicAndPaymentInfoWithQuotesFormComponentApi {
    setProcessingCompleted(): void;
    showCreditCardSubmissionError(): void;
    clearCreditCardSubmissionError(): void;
    showUnexpectedSubmissionError(): void;
    clearUnexpectedSubmissionError(): void;
    resetFallbackLoadedFields(): void;
}

export interface AccountInfoBasicAndPaymentInfoWithQuotesLegacyExtraData {
    isBothRadios?: boolean;
    isPlatinumVIP?: boolean;
    showTotalAsPaid?: boolean;
    isUpgradePkg?: boolean;
    isAnnual?: boolean;
    isAcsc?: boolean;
    isFlepz?: boolean;
}

export interface AccountInfoBasicAndPaymentInfoWithQuotesData {
    paymentInfo: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        nameOnCard: string;
        cardNumber: string;
        expirationDate: string;
        cvv: string;
        giftCard: string;
        zip: string;
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
    selector: 'de-care-account-info-basic-and-payment-info-with-quotes-form',
    templateUrl: './account-info-basic-and-payment-info-with-quotes-form.component.html',
    styleUrls: ['./account-info-basic-and-payment-info-with-quotes-form.component.scss'],
})
export class AccountInfoBasicAndPaymentInfoWithQuotesFormComponent
    implements AccountInfoBasicAndPaymentInfoWithQuotesFormComponentApi, AfterViewInit, OnDestroy, ComponentWithLocale
{
    quoteViewModel$ = new BehaviorSubject(null);
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    nameOnCardAsHiddenInput = true;
    @Input() set country(value: string) {
        this.paymentForm?.controls?.country?.patchValue(value?.toUpperCase(), { emitEvent: false });
    }
    @Input() initialState: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        zip: string;
        creditCard: { nameOnCard: string; cardNumber: string; expirationDate: string };
    } | null = null;
    @Output() formCompleted = new EventEmitter<AccountInfoBasicAndPaymentInfoWithQuotesData>();
    @Output() zipCodeAddressCollected = new EventEmitter<AccountInfoBasicAndPaymentInfoWithQuotesData>();
    @Input() set quoteViewModel(quoteViewModel) {
        this.quoteViewModel$.next(quoteViewModel);
    }
    @Input() shouldIncludeNuCaptcha = false;
    @Input() showUnusedCreditLine = false;
    @Input() continueButtonTextOverride: string;
    @Input() useQuotesAlternateHeader = false;
    // TODO: refactor this to be more specific at the quote-summary component level as to what it is doing
    @Input() legacySettings: { isStreamingFlow: boolean; isNewAccount: boolean } = { isStreamingFlow: false, isNewAccount: false };
    @Input() extraData: AccountInfoBasicAndPaymentInfoWithQuotesLegacyExtraData;
    transactionForm: FormGroup;
    captchaAnswerWrong$ = new BehaviorSubject(false);
    processing$ = new BehaviorSubject(false);
    @ViewChild('nuCaptchaComponent') private readonly _nuCaptchaComponent: SxmUiNucaptchaComponent;
    @Input() isQuebecProvince;
    @Input() useRateVersionOfTextCopy;
    paymentForm: FormGroup;
    @ViewChild('creditCardFieldsSection') private readonly _creditCardFieldsSection: ElementRef;
    @ViewChild(SxmUiCreditCardFormFieldsComponent) private readonly _creditCardFormFieldsComponent: CreditCardFormFieldsComponentApi;
    creditCardSubmissionError$ = new BehaviorSubject(false);
    invalidZipFromLookupError$ = new BehaviorSubject(false);
    unexpectedSubmissionError$ = new BehaviorSubject(false);
    skipChange = false;
    get zipCodeControl() {
        return this.paymentForm.get('zip') as FormControl;
    }
    private destroy$ = new Subject<boolean>();

    constructor(
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _sxmValidators: SxmValidators,
        private readonly _customerValidationAddressesWorkFlowService: CustomerValidationAddressesWorkFlowService,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _validateNuCaptchaWorkflowService: ValidateNucaptchaWorkflowService
    ) {
        translationsForComponentService.init(this);
        this.paymentForm = this._formBuilder.group({
            firstName: new FormControl(null, { validators: this._sxmValidators.namePiece, updateOn: 'blur' }),
            lastName: new FormControl(null, { validators: this._sxmValidators.namePiece, updateOn: 'blur' }),
            phoneNumber: new FormControl(null, { validators: this._sxmValidators.phoneNumber, updateOn: 'blur' }),
            zip: new FormControl(null, { validators: this._sxmValidators.postalCode, updateOn: 'blur' }),
            country: new FormControl('US', this._sxmValidators.countryCode),
            creditCardInfo: new FormGroup({}),
            giftCard: new FormControl(null),
            city: new FormControl(null),
            state: new FormControl(null),
        });
        this.transactionForm = this._formBuilder.group({
            chargeAgreementAccepted: [false, { validators: [Validators.requiredTrue] }],
            nuCaptchaAnswer: null,
        });
    }

    ngAfterViewInit(): void {
        if (this.initialState) {
            const { firstName, lastName, phoneNumber, zip, creditCard } = this.initialState;
            this.paymentForm.patchValue({ firstName, lastName, phoneNumber, zip, creditCardInfo: creditCard });
            this._changeDetectorRef.detectChanges();
        }
        wireUpCreditCardNameAutofill(
            this.paymentForm?.controls?.firstName,
            this.paymentForm?.controls?.lastName,
            this._creditCardFormFieldsComponent?.nameOnCard,
            this.nameOnCardAsHiddenInput
        )
            .pipe(takeUntil(this.destroy$))
            .subscribe();

        this.zipCodeControl.valueChanges
            .pipe(
                filter(() => !this.skipChange),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                if (this.zipCodeControl.valid) {
                    this.submitPaymentInfo();
                } else {
                    this.setInitialQuotesState();
                }
            });
    }

    setProcessingCompleted(): void {
        this.processing$.next(false);
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
        this.processing$.next(false);
        this._changeDetectorRef.detectChanges();
        scrollToElement(this._creditCardFieldsSection.nativeElement);
    }

    clearUnexpectedSubmissionError(): void {
        this.unexpectedSubmissionError$.next(false);
        this._changeDetectorRef.detectChanges();
    }

    resetFallbackLoadedFields(): void {
        this.transactionForm.patchValue({
            chargeAgreementAccepted: false,
        });
        this.processing$.next(false);
        this.paymentForm.get('creditCardInfo')?.get('cvv')?.setValue(null);
        this._changeDetectorRef.detectChanges();
    }

    onPrepaidCardSubmitted(data: AddedGiftCardData) {
        this.paymentForm.get('giftCard').patchValue(data.pin, { emitEvent: false });
    }

    onPrepaidCardCleared() {
        this.paymentForm.get('giftCard').patchValue(null, { emitEvent: false });
    }

    submitPaymentInfo() {
        this._customerValidationAddressesWorkFlowService
            .build({ serviceAddress: { zip: this.zipCodeControl.value } })
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
                    if (correctedAddress) {
                        this.skipChange = true;
                        this.paymentForm.patchValue(
                            {
                                zip: correctedAddress.zip,
                                city: correctedAddress.city,
                                state: correctedAddress.state,
                            },
                            { emitEvent: false }
                        );
                    }
                    this.transactionForm.patchValue({
                        chargeAgreementAccepted: false,
                    });
                    const { creditCardInfo, ...paymentInfo } = this.paymentForm.value;
                    this.zipCodeAddressCollected.next({ paymentInfo: { ...paymentInfo, ...creditCardInfo } });
                },
                error: (error) => {
                    if (error === 'INVALID_ZIP') {
                        this.paymentForm.get('zip').setErrors({ notValid: true });
                        this.invalidZipFromLookupError$.next(true);
                        this.setInitialQuotesState();
                    }
                },
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    submitTransaction() {
        this.paymentForm.markAllAsTouched();
        this.transactionForm.markAllAsTouched();
        this.creditCardSubmissionError$.next(false);
        this.invalidZipFromLookupError$.next(false);
        this.unexpectedSubmissionError$.next(false);
        if (this.transactionForm.valid && this.paymentForm.valid) {
            this.processing$.next(true);
            if (this.shouldIncludeNuCaptcha && this._nuCaptchaComponent) {
                this._validateNuCaptchaWorkflowService
                    .build({ answer: this.transactionForm.value.nuCaptchaAnswer.answer, token: this._nuCaptchaComponent?.getCaptchaToken() })
                    .subscribe({
                        next: (valid) => {
                            if (valid) {
                                const { creditCardInfo, ...paymentInfo } = this.paymentForm.value;
                                this.formCompleted.next({ paymentInfo: { ...paymentInfo, ...creditCardInfo } });
                            } else {
                                this.captchaAnswerWrong$.next(true);
                                this.processing$.next(false);
                            }
                        },
                        error: () => {
                            // TODO: display system error
                            this.processing$.next(false);
                        },
                    });
            } else {
                const { creditCardInfo, ...paymentInfo } = this.paymentForm.value;
                this.formCompleted.next({ paymentInfo: { ...paymentInfo, ...creditCardInfo } });
            }
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
        }
    }

    onZipCodeChanged() {
        this.setQuotesLoading();
        this.skipChange = false;
    }

    private setInitialQuotesState() {
        this.processing$.next(false);
        this.quoteViewModel$.next(null);
    }

    private setQuotesLoading() {
        this.processing$.next(true);
        this.quoteViewModel$.next(null);
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
