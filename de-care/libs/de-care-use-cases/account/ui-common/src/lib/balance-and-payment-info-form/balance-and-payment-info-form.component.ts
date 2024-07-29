import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, Subject, throwError, Observable } from 'rxjs';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { catchError, map, tap, startWith } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { ValidateAddressWorkflowWorkflowError, ValidateAddressWorkflowService } from '@de-care/de-care-use-cases/account/state-common';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import * as uuid from 'uuid/v4';

export interface BalanceAndPaymentInfoFormComponentApi {
    setProcessingCompleted(): void;
    showCreditCardSubmissionError(): void;
    clearCreditCardSubmissionError(): void;
    showUnexpectedSubmissionError(): void;
    clearUnexpectedSubmissionError(): void;
}

export type PaymentFrequency = 'recurring' | 'oneTime';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-balance-and-payment-info-form',
    templateUrl: './balance-and-payment-info-form.component.html',
    styleUrls: ['./balance-and-payment-info-form.component.scss'],
})
export class BalanceAndPaymentInfoFormComponent implements ComponentWithLocale, BalanceAndPaymentInfoFormComponentApi, OnInit, AfterViewInit, OnDestroy {
    @Input() isUpdatePaymentMethodOnly = false;
    @Input() set country(value: string) {
        this.paymentForm?.controls?.country?.patchValue(value?.toUpperCase(), { emitEvent: false });
    }
    @Input() initialState: {
        address: {
            addressLine1: string;
            city: string;
            state: string;
            zip: string;
        };
        creditCard: { nameOnCard: string; cardNumber: string; expirationDate: string };
        chargeAgreementAccepted: boolean;
        paymentAmountOption: number;
        paymentFrequencyOption: PaymentFrequency;
    } | null = null;
    @Input() balanceDataValues: { currentBalanceDue: number; nextPaymentAmount: number; nextPaymentDueDate: string; totalAmountDue: number; reactivationAmount: number };
    @Input() canSelectAmountToPay = false;
    @Input() canSelectPaymentFrequency = false;
    @Input() withoutFees = false;
    @Output() formCompleted = new EventEmitter<any>();
    @ViewChild('verifyAddressModal') private readonly _verifyAddressModal: SxmUiModalComponent;
    @ViewChild('creditCardFieldsSection') private readonly _creditCardFieldsSection: ElementRef;

    languageResources: LanguageResources;
    translateKeyPrefix: string;
    paymentForm: FormGroup;
    verifyAddressesDataViewModel$: any;
    paymentFormSubmitted = false;
    recurring: PaymentFrequency = 'recurring';
    oneTime: PaymentFrequency = 'oneTime';
    currentLang$;
    private _unsubscribe$ = new Subject<void>();
    balancePaymentModalAriaDescribedbyTextId = uuid();

    paymentFormProcessing$ = new BehaviorSubject(false);
    creditCardSubmissionError$ = new BehaviorSubject(false);
    unexpectedSubmissionError$ = new BehaviorSubject(false);

    paymentFrequency$: Observable<PaymentFrequency>;

    get amountOptionIsInvalid(): boolean {
        const amountForm = this.paymentForm?.get('paymentAmountOption');
        return amountForm?.touched && amountForm?.invalid;
    }

    get frequencyOptionIsInvalid(): boolean {
        const frequencyForm = this.paymentForm.get('paymentFrequencyOption');
        return frequencyForm?.touched && frequencyForm?.invalid;
    }

    private _skipAddressValidationOnSuggestionAccept = false;
    private _avsValidated = false;
    private readonly _addressSuggestionsViewModel$ = new BehaviorSubject<{ correctedAddresses: any[]; addressCorrectionAction: any }>({
        correctedAddresses: [],
        addressCorrectionAction: null,
    });
    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _sxmValidators: SxmValidators,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _validateAddressWorkflowService: ValidateAddressWorkflowService
    ) {
        translationsForComponentService.init(this);
        this.currentLang$ = translationsForComponentService.currentLang$;
        this.paymentForm = this._formBuilder.group({
            serviceAddress: null,
            creditCardInfo: new FormGroup({}),
            chargeAgreementAccepted: new FormControl(null, Validators.required),
            paymentAmountOption: new FormControl(this.balanceDataValues?.nextPaymentAmount),
            paymentFrequencyOption: new FormControl(this.recurring),
            country: new FormControl('US', this._sxmValidators.countryCode),
        });

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

    ngOnInit(): void {
        if (this.canSelectAmountToPay) {
            this.paymentForm.get('paymentAmountOption').setValidators(Validators.required);
            this.paymentForm.get('paymentAmountOption').setValue(this.balanceDataValues.totalAmountDue);
        } else {
            const paymentAmountOption = (this.balanceDataValues.currentBalanceDue || this.balanceDataValues.nextPaymentAmount) + this.balanceDataValues.reactivationAmount;
            this.paymentForm.get('paymentAmountOption').setValue(paymentAmountOption);
        }
        this.canSelectPaymentFrequency && this.paymentForm.get('paymentFrequencyOption').setValidators(Validators.required);
        this.paymentFrequency$ = this.paymentForm.get('paymentFrequencyOption').valueChanges.pipe(startWith('recurring'));
    }

    ngAfterViewInit(): void {
        if (this.initialState) {
            const { address, creditCard, paymentAmountOption, paymentFrequencyOption } = this.initialState;
            this.paymentForm.patchValue({ serviceAddress: address, creditCardInfo: creditCard, paymentAmountOption, paymentFrequencyOption });
        }
    }

    ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    setProcessingCompleted(): void {
        this.paymentFormProcessing$.next(false);
        this._changeDetectorRef.detectChanges();
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
        if (this.paymentForm.valid && this.paymentForm?.get('chargeAgreementAccepted')) {
            const { paymentInfo } = this._formDataAsPaymentInfo();
            this._validateAddressWorkflowService
                .build({ paymentInfo, skipAddressValidation: this._skipAddressValidationOnSuggestionAccept })
                .pipe(
                    tap((result) => {
                        if (result?.correctedAddress) {
                            const { avsValidated, ...address } = result.correctedAddress;
                            this._avsValidated = avsValidated;
                            this._updateAddress(address);
                        }
                    }),
                    catchError((error: ValidateAddressWorkflowWorkflowError) => {
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
                        this.formCompleted.next(this._formDataAsPaymentInfo());
                    },
                    error: () => {
                        // TODO: show system error message
                        this.paymentFormProcessing$.next(false);
                    },
                });
        } else {
            const errors = [];
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

    onBackToAccount() {
        //TODO: Navigate to account information
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

    clearUnexpectedSubmissionError(): void {
        this.unexpectedSubmissionError$.next(false);
        this._changeDetectorRef.detectChanges();
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
