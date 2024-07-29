import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { PaymentInfoData } from '../payment-info-form/payment-info-form.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, Subject, throwError } from 'rxjs';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { TranslateService } from '@ngx-translate/core';
import { CheckoutValidateAddressWorkflowWorkflowError, CheckoutValidateAddressWorkflowService } from '@de-care/de-care-use-cases/checkout/state-common';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { wireUpCreditCardNameAutofill } from '@de-care/shared/forms/forms-common';
import { CreditCardFormFieldsComponentApi, SxmUiCreditCardFormFieldsComponent } from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import { AddedGiftCardData } from '@de-care/domains/payment/ui-prepaid-redeem';
import * as uuid from 'uuid/v4';

export interface AccountInfoAndPaymentInfoFormComponentApi {
    setProcessingCompleted(): void;
    showCreditCardSubmissionError(): void;
    clearCreditCardSubmissionError(): void;
    showUnexpectedSubmissionError(): void;
    clearUnexpectedSubmissionError(): void;
}

export interface AccountInfoAndPaymentInfoData {
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

@Component({
    selector: 'de-care-account-info-and-payment-info-form',
    templateUrl: './account-info-and-payment-info-form.component.html',
    styleUrls: ['./account-info-and-payment-info-form.component.scss'],
})
export class AccountInfoAndPaymentInfoFormComponent implements AccountInfoAndPaymentInfoFormComponentApi, AfterViewInit, OnDestroy {
    translateKeyPrefix = 'DeCareUseCasesCheckoutUiCommonModule.AccountInfoAndPaymentInfoFormComponent.';
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
    @Output() formCompleted = new EventEmitter<PaymentInfoData>();
    accountInfoPaymentModalAriaDescribedbyTextId = uuid();

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
    verifyAddressesDataViewModel$ = combineLatest([this._addressSuggestionsViewModel$, this._translateService.stream(`${this.translateKeyPrefix}CONFIRM_YOUR_ADDRESS`)]).pipe(
        map(([viewModel, headingText]) => ({
            ...viewModel,
            headingText,
            currentAddress: { ...this.paymentForm.controls.serviceAddress.value },
        }))
    );
    creditCardSubmissionError$ = new BehaviorSubject(false);
    unexpectedSubmissionError$ = new BehaviorSubject(false);
    private destroy$ = new Subject<boolean>();

    constructor(
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _sxmValidators: SxmValidators,
        private readonly _translateService: TranslateService,
        private readonly _checkoutValidateAddressWorkflowService: CheckoutValidateAddressWorkflowService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        this.paymentForm = this._formBuilder.group({
            firstName: new FormControl(null, { validators: this._sxmValidators.namePiece, updateOn: 'blur' }),
            lastName: new FormControl(null, { validators: this._sxmValidators.namePiece, updateOn: 'blur' }),
            phoneNumber: new FormControl(null, { validators: this._sxmValidators.phoneNumber, updateOn: 'blur' }),
            serviceAddress: null,
            country: new FormControl('US', this._sxmValidators.countryCode),
            creditCardInfo: new FormGroup({}),
            giftCard: new FormControl(null),
        });
    }

    ngAfterViewInit(): void {
        wireUpCreditCardNameAutofill(this.paymentForm?.controls?.firstName, this.paymentForm?.controls?.lastName, this._creditCardFormFieldsComponent?.nameOnCard)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        if (this.initialState) {
            const { firstName, lastName, phoneNumber, address, creditCard } = this.initialState;
            this.paymentForm.patchValue({ firstName, lastName, phoneNumber, serviceAddress: address, creditCardInfo: creditCard });
        }
        this._changeDetectorRef.detectChanges();
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
            this._checkoutValidateAddressWorkflowService
                .build({ paymentInfo, skipAddressValidation: this._skipAddressValidationOnSuggestionAccept })
                .pipe(
                    tap((result) => {
                        if (result?.correctedAddress) {
                            const { avsValidated, ...address } = result.correctedAddress;
                            this._avsValidated = avsValidated;
                            this._updateAddress(address);
                        }
                    }),
                    catchError((error: CheckoutValidateAddressWorkflowWorkflowError) => {
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
