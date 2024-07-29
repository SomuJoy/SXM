import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CheckoutValidateAddressWorkflowService } from '@de-care/de-care-use-cases/checkout/state-common';
import { DomainsCustomerUiVerifyAddressModule } from '@de-care/domains/customer/ui-verify-address';
import { controlIsInvalid, SxmValidators } from '@de-care/shared/forms-validation';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiFormsUiFirstNameFormFieldModule } from '@de-care/shared/sxm-ui/forms/ui-first-name-form-field';
import { SharedSxmUiUiAddressFormFieldsModule, SxmUiAddressComponentApi } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { SharedSxmUiUiFormFieldMasksModule } from '@de-care/shared/sxm-ui/ui-form-field-masks';
import { SharedSxmUiUiLastNameFormFieldModule } from '@de-care/shared/sxm-ui/ui-last-name-form-field';
import { SharedSxmUiUiModalModule, SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiPasswordFormFieldModule } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-phone-number-form-field';
import { SharedSxmUiUiPostalCodeFormFieldModule } from '@de-care/shared/sxm-ui/ui-postal-code-form-field';
import { SharedSxmUiUiPostalCodeFormWrapperModule, SxmUiPostalCodeFormWrapperApi } from '@de-care/shared/sxm-ui/ui-postal-code-form-wrapper';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { ComponentLocale, ComponentWithLocale, LanguageResources, SxmLanguages, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

export interface AccountInfoAndZipFormFieldData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    avsValidated: boolean;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-account-info-and-zip-form-field-page',
    templateUrl: './account-info-and-zip-form-field-page.component.html',
    styleUrls: ['./account-info-and-zip-form-field-page.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        SharedSxmUiUiPostalCodeFormFieldModule,
        ReactiveFormsModule,
        TranslateModule,
        SharedSxmUiFormsUiFirstNameFormFieldModule,
        SharedSxmUiUiLastNameFormFieldModule,
        SharedSxmUiUiPhoneNumberFormFieldModule,
        SharedSxmUiUiAddressFormFieldsModule,
        SharedSxmUiUiPasswordFormFieldModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiFormFieldMasksModule,
        SharedSxmUiUiPostalCodeFormWrapperModule,
        AccountInfoAndZipFormFieldPageComponent,
        DomainsCustomerUiVerifyAddressModule,
        SharedSxmUiUiModalModule,
    ],
})
export class AccountInfoAndZipFormFieldPageComponent implements ComponentWithLocale, OnInit, OnDestroy {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    currentLang: SxmLanguages;
    submitted: boolean = false;
    inputIsFocused = false;
    invalidZipFromLookupError$ = new BehaviorSubject(false);

    @Input() set country(value: string) {
        this.paymentForm?.controls?.country?.patchValue(value?.toUpperCase(), { emitEvent: false });
    }

    controlIsInvalid = controlIsInvalid(() => {
        return this.submitted;
    });
    translateKey = 'sharedSxmUiUiAddressFormFieldsModule.addressFormFieldsOemComponent';
    @Input() isFullAddressForm: boolean = false;
    @Output() formCompleted = new EventEmitter<AccountInfoAndZipFormFieldData>();
    @ViewChild('verifyAddressModal') private readonly _verifyAddressModal: SxmUiModalComponent;
    @ViewChild('serviceAddress') private _serviceAddressComponent: SxmUiAddressComponentApi;
    @ViewChild('postalCodeFormWrapper', { static: false }) private postalCodeFormWrapper: SxmUiPostalCodeFormWrapperApi;
    paymentForm: FormGroup;
    paymentFormProcessing$ = new BehaviorSubject(false);
    paymentFormSubmitted = false;
    showInvalidServiceAddressError = false;
    private readonly _addressSuggestionsViewModel$ = new BehaviorSubject<{ correctedAddresses: any[]; addressCorrectionAction: any }>({
        correctedAddresses: [],
        addressCorrectionAction: null,
    });
    verifyAddressesDataViewModel$: Observable<{
        headingText: string;
        currentAddress: any;
        correctedAddresses: any[];
        addressCorrectionAction: any;
    }>;

    private _avsValidated = false;
    private _skipAddressValidationOnSuggestionAccept = false;
    unexpectedSubmissionError$ = new BehaviorSubject(false);
    private destroy$: Subject<boolean> = new Subject<boolean>();
    accountInfoZipFormModalAriaDescribedbyTextId = uuid();

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _sxmValidators: SxmValidators,
        private readonly _checkoutValidateAddressWorkflowService: CheckoutValidateAddressWorkflowService,

        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        translationsForComponentService.init(this);
        this.paymentForm = this._formBuilder.group({
            firstName: new FormControl(null, { validators: this._sxmValidators.namePiece, updateOn: 'blur' }),
            lastName: new FormControl(null, { validators: this._sxmValidators.namePiece, updateOn: 'blur' }),
            phoneNumber: new FormControl(null, { validators: this._sxmValidators.phoneNumber, updateOn: 'blur' }),
            country: new FormControl('US', this._sxmValidators.countryCode),
        });
        this.verifyAddressesDataViewModel$ = combineLatest([
            this._addressSuggestionsViewModel$,
            this.translationsForComponentService.stream(`${this.translateKeyPrefix}.CONFIRM_YOUR_ADDRESS`),
        ]).pipe(
            map(([viewModel, headingText]) => ({
                ...viewModel,
                headingText,
                currentAddress: { ...this.paymentForm.controls.serviceAddress?.value },
            }))
        );
    }

    ngOnInit(): void {
        if (this.isFullAddressForm && this.isFullAddressForm !== undefined) {
            if (!this.paymentForm.controls['serviceAddress']) {
                this.paymentForm.addControl('serviceAddress', new FormControl(''));
            }
        } else if (this.isFullAddressForm !== undefined) {
            if (!this.paymentForm.controls['zip']) {
                this.paymentForm.addControl('zip', new FormControl('', { validators: this._sxmValidators.postalCode, updateOn: 'blur' }));
            }
        }
    }

    private _formDataAsPaymentInfo() {
        const { serviceAddress, ...paymentInfo } = this.paymentForm.value;
        return { ...paymentInfo, ...serviceAddress, avsValidated: this._avsValidated };
    }

    private _updateAddress(address) {
        this.paymentForm.get('serviceAddress').patchValue({ ...address }, { emitEvent: false });
    }

    showUnexpectedSubmissionError(): void {
        this.unexpectedSubmissionError$.next(true);
        this._changeDetectorRef.detectChanges();
        //scrollToElement(this._creditCardFieldsSection.nativeElement);
    }

    clearUnexpectedSubmissionError(): void {
        this.unexpectedSubmissionError$.next(false);
        this._changeDetectorRef.detectChanges();
    }

    submitPaymentInfo() {
        this.paymentForm.markAllAsTouched();
        this.paymentFormProcessing$.next(true);
        this.paymentFormSubmitted = true;
        this.invalidZipFromLookupError$.next(false);

        this.unexpectedSubmissionError$.next(false);
        if (this.paymentForm.valid) {
            const paymentInfo = this._formDataAsPaymentInfo();
            this._checkoutValidateAddressWorkflowService
                .build({ paymentInfo, skipAddressValidation: this._skipAddressValidationOnSuggestionAccept })
                .pipe(
                    tap((result) => {
                        if (result?.correctedAddress) {
                            const { avsValidated, ...address } = result.correctedAddress;
                            this._avsValidated = avsValidated;
                            if (this.isFullAddressForm) {
                                this._updateAddress(address);
                            }
                        }
                    }),
                    catchError((error) => {
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
                    error: (err) => {
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
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this.paymentFormProcessing$.next(false);
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

    ngOnDestroy(): void {
        this.destroy$.next(true);
    }
}
