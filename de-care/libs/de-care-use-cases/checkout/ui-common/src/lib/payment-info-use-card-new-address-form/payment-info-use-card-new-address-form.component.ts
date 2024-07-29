import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgModule, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatePaymentInfoWorkflowError, ValidatePaymentInfoWorkflowService } from '@de-care/domains/customer/state-customer-verification';
import { DomainsCustomerUiVerifyAddressModule } from '@de-care/domains/customer/ui-verify-address';
import { AddedGiftCardData, DomainsPaymentUiPrepaidRedeemModule } from '@de-care/domains/payment/ui-prepaid-redeem';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { SharedSxmUiUiCreditCardFormFieldsModule, SxmUiCreditCardFormFieldsComponent } from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import { SharedSxmUiUiModalModule, SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

export interface PaymentInfoUseCardNewAddressFormComponentApi {
    setProcessingCompleted(): void;
    showCreditCardSubmissionError(): void;
    clearCreditCardSubmissionError(): void;
    showUnexpectedSubmissionError(): void;
    clearUnexpectedSubmissionError(): void;
}

export interface PaymentInfoUseCardNewAddressData {
    useCardOnFile: boolean;
    paymentInfo: {
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
    selector: 'de-care-payment-info-use-card-new-address-form',
    templateUrl: './payment-info-use-card-new-address-form.component.html',
    styleUrls: ['./payment-info-use-card-new-address-form.component.scss'],
})
export class PaymentInfoUseCardNewAddressFormComponent implements ComponentWithLocale, PaymentInfoUseCardNewAddressFormComponentApi, AfterViewInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() set options(options: { useCardOnFileAllowed: boolean; cardType?: string; cardNumberLastFour?: string }) {
        this.useCardOnFileAllowed = !!options?.useCardOnFileAllowed;
        this.cardType = options?.cardType;
        this.cardNumberLastFour = options?.cardNumberLastFour;
        if (this.useCardOnFileAllowed) {
            this.paymentForm.patchValue({ paymentMethod: null }, { emitEvent: false });
        }
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
        useCardOnFile: boolean;
    } | null = null;
    @Input() continueButtonTextOverride: string;
    @Output() formCompleted = new EventEmitter<PaymentInfoUseCardNewAddressData>();

    useCardOnFileAllowed = false;
    cardType: string;
    cardNumberLastFour: string;
    paymentForm: FormGroup;
    newCard: FormGroup;
    paymentFormSubmitted = false;
    paymentFormProcessing$ = new BehaviorSubject(false);
    @ViewChild('verifyAddressModal') private readonly _verifyAddressModal: SxmUiModalComponent;
    @ViewChild(SxmUiCreditCardFormFieldsComponent) private readonly _creditCardFormFieldsComponent: ElementRef;
    private _skipAddressValidationOnSuggestionAccept = false;
    private _avsValidated = false;
    private readonly _addressSuggestionsViewModel$ = new BehaviorSubject<{ correctedAddresses: any[]; addressCorrectionAction: any }>({
        correctedAddresses: [],
        addressCorrectionAction: null,
    });
    verifyAddressesDataViewModel$: Observable<unknown>;
    paymentMethodSelectionError$ = new BehaviorSubject(false);
    creditCardSubmissionError$ = new BehaviorSubject(false);
    unexpectedSubmissionError$ = new BehaviorSubject(false);
    paymentInfoNewAddCardModalAriaDescribedbyTextId = uuid();

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _sxmValidators: SxmValidators,
        private readonly _translateService: TranslateService,
        private readonly _validatePaymentInfoWorkflowService: ValidatePaymentInfoWorkflowService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        translationsForComponentService.init(this);
        this.verifyAddressesDataViewModel$ = combineLatest([
            this._addressSuggestionsViewModel$,
            this._translateService.stream(`${this.translateKeyPrefix}CONFIRM_YOUR_ADDRESS`),
        ]).pipe(
            map(([viewModel, headingText]) => ({
                ...viewModel,
                headingText,
                currentAddress: { ...this.newCard.controls.serviceAddress.value },
            }))
        );
        this.newCard = this._formBuilder.group({
            serviceAddress: null,
            country: new FormControl('US', this._sxmValidators.countryCode),
            creditCardInfo: new FormGroup({}),
            giftCard: new FormControl(null),
        });
        this.paymentForm = this._formBuilder.group({
            paymentMethod: new FormControl('NEW_CARD', Validators.required),
            newCard: this.newCard,
            giftCard: new FormControl(null),
        });
    }

    ngAfterViewInit(): void {
        if (this.initialState) {
            const { address, creditCard, useCardOnFile } = this.initialState;
            if (useCardOnFile) {
                this.paymentForm.patchValue({ paymentMethod: 'CARD_ON_FILE' });
            } else {
                this.paymentForm.patchValue({ paymentMethod: 'NEW_CARD' });
                this.newCard.patchValue({ serviceAddress: address, creditCardInfo: creditCard });
            }
            this._changeDetectorRef.detectChanges();
        }
    }

    setProcessingCompleted(): void {
        this.paymentFormProcessing$.next(false);
    }

    showCreditCardSubmissionError(): void {
        this.creditCardSubmissionError$.next(true);
        this._changeDetectorRef.detectChanges();
        scrollToElement(this._creditCardFormFieldsComponent.nativeElement);
    }

    clearCreditCardSubmissionError(): void {
        this.creditCardSubmissionError$.next(false);
        this._changeDetectorRef.detectChanges();
    }

    showUnexpectedSubmissionError(): void {
        this.unexpectedSubmissionError$.next(true);
        this._changeDetectorRef.detectChanges();
        scrollToElement(this._creditCardFormFieldsComponent.nativeElement);
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
        this.submitPaymentInfo();
        this._verifyAddressModal.close();
    }

    private _updateAddress(address) {
        this.newCard.get('serviceAddress').patchValue({ ...address }, { emitEvent: false });
    }

    private _formDataAsPaymentInfo() {
        const { creditCardInfo, serviceAddress, ...paymentInfo } = this.newCard.value;
        return { paymentInfo: { ...paymentInfo, ...creditCardInfo, ...serviceAddress, avsValidated: this._avsValidated }, useCardOnFile: false };
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
            this.newCard.markAllAsTouched();
            if (this.newCard.valid) {
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

@NgModule({
    declarations: [PaymentInfoUseCardNewAddressFormComponent],
    exports: [PaymentInfoUseCardNewAddressFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiRadioOptionFormFieldModule,
        SharedSxmUiUiAddressFormFieldsModule,
        DomainsPaymentUiPrepaidRedeemModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiModalModule,
        DomainsCustomerUiVerifyAddressModule,
        SharedSxmUiUiCreditCardFormFieldsModule,
    ],
})
export class PaymentInfoUseCardNewAddressFormComponentModule {}

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
