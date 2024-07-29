import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { CustomerValidationAddressesWorkFlowService } from '@de-care/domains/customer/state-customer-verification';
import { map, takeUntil } from 'rxjs/operators';
import { CreditCardFormFieldsComponentApi, SxmUiCreditCardFormFieldsComponent } from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import { wireUpCreditCardNameAutofill } from '@de-care/shared/forms/forms-common';
import { AddedGiftCardData } from '@de-care/domains/payment/ui-prepaid-redeem';

export interface AccountInfoBasicAndPaymentInfoFormComponentApi {
    setProcessingCompleted(): void;
    showCreditCardSubmissionError(): void;
    clearCreditCardSubmissionError(): void;
    showUnexpectedSubmissionError(): void;
    clearUnexpectedSubmissionError(): void;
}

export interface AccountInfoBasicAndPaymentInfoData {
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

@Component({
    selector: 'de-care-account-info-basic-and-payment-info-form',
    templateUrl: './account-info-basic-and-payment-info-form.component.html',
    styleUrls: ['./account-info-basic-and-payment-info-form.component.scss'],
})
export class AccountInfoBasicAndPaymentInfoFormComponent implements AccountInfoBasicAndPaymentInfoFormComponentApi, AfterViewInit, OnDestroy {
    translateKeyPrefix = 'DeCareUseCasesCheckoutUiCommonModule.AccountInfoBasicAndPaymentInfoFormComponent.';
    @Input() set country(value: string) {
        this.paymentForm?.controls?.country?.patchValue(value?.toUpperCase(), { emitEvent: false });
    }
    @Input() initialState: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        address: {
            addressLine1?: string;
            city?: string;
            state?: string;
            zip: string;
        };
        creditCard: { nameOnCard: string; cardNumber: string; expirationDate: string };
    } | null = null;
    @Output() formCompleted = new EventEmitter<AccountInfoBasicAndPaymentInfoData>();

    paymentForm: FormGroup;
    paymentFormSubmitted = false;
    nameOnCardAsHiddenInput = true;
    paymentFormProcessing$ = new BehaviorSubject(false);
    @ViewChild('creditCardFieldsSection') private readonly _creditCardFieldsSection: ElementRef;
    @ViewChild(SxmUiCreditCardFormFieldsComponent) private readonly _creditCardFormFieldsComponent: CreditCardFormFieldsComponentApi;
    creditCardSubmissionError$ = new BehaviorSubject(false);
    invalidZipFromLookupError$ = new BehaviorSubject(false);
    unexpectedSubmissionError$ = new BehaviorSubject(false);
    private destroy$ = new Subject<boolean>();

    constructor(
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _sxmValidators: SxmValidators,
        private readonly _customerValidationAddressesWorkFlowService: CustomerValidationAddressesWorkFlowService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        this.paymentForm = this._formBuilder.group({
            firstName: new FormControl(null, { validators: this._sxmValidators.namePiece, updateOn: 'blur' }),
            lastName: new FormControl(null, { validators: this._sxmValidators.namePiece, updateOn: 'blur' }),
            phoneNumber: new FormControl(null, { validators: this._sxmValidators.phoneNumber, updateOn: 'blur' }),
            zip: new FormControl(null, { validators: this._sxmValidators.postalCode, updateOn: 'blur' }),
            country: new FormControl('US', this._sxmValidators.countryCode),
            creditCardInfo: new FormGroup({}),
            giftCard: new FormControl(null),
        });
    }

    ngAfterViewInit(): void {
        wireUpCreditCardNameAutofill(
            this.paymentForm?.controls?.firstName,
            this.paymentForm?.controls?.lastName,
            this._creditCardFormFieldsComponent?.nameOnCard,
            this.nameOnCardAsHiddenInput
        )
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        if (this.initialState) {
            const { firstName, lastName, phoneNumber, creditCard, address } = this.initialState;
            const zip = address?.zip;
            this.paymentForm.patchValue({ firstName, lastName, phoneNumber, zip, creditCardInfo: creditCard });
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

    submitPaymentInfo() {
        this.paymentForm.markAllAsTouched();
        this.paymentFormProcessing$.next(true);
        this.paymentFormSubmitted = true;
        this.creditCardSubmissionError$.next(false);
        this.invalidZipFromLookupError$.next(false);
        this.unexpectedSubmissionError$.next(false);
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
                        const { creditCardInfo, ...paymentInfo } = this.paymentForm.value;
                        this.formCompleted.next({ paymentInfo: { ...paymentInfo, ...creditCardInfo, ...cityAndState } });
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