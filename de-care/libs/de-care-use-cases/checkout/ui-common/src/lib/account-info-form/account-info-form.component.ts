import { CommonModule } from '@angular/common';
import { Component, NgModule, AfterViewInit, Input, Output, EventEmitter, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomainsCustomerUiVerifyAddressModule } from '@de-care/domains/customer/ui-verify-address';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiFormsUiFirstNameFormFieldModule } from '@de-care/shared/sxm-ui/forms/ui-first-name-form-field';
import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiEmailFormFieldModule } from '@de-care/shared/sxm-ui/ui-email-form-field';
import { SharedSxmUiUiLastNameFormFieldModule } from '@de-care/shared/sxm-ui/ui-last-name-form-field';
import { SharedSxmUiUiModalModule, SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-phone-number-form-field';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ValidatePaymentInfoWorkflowError, ValidatePaymentInfoWorkflowService } from '@de-care/domains/customer/state-customer-verification';
import * as uuid from 'uuid/v4';

export interface AccountInfoFormComponentApi {
    setProcessingCompleted(): void;
    showUnexpectedSubmissionError(): void;
    clearUnexpectedSubmissionError(): void;
    showEmailInUseError(): void;
    showEmailNotAllowedError(): void;
}
export interface AccountInfoFormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    serviceAddress: {
        addressLine1: string;
        city: string;
        state: string;
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
    selector: 'de-care-account-info-form',
    templateUrl: './account-info-form.component.html',
    styleUrls: ['./account-info-form.component.scss'],
})
export class AccountInfoFormComponent implements ComponentWithLocale, AccountInfoFormComponentApi, OnInit, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() initialState: AccountInfoFormData | null = null;
    @Output() formCompleted = new EventEmitter<AccountInfoFormData>();
    form: FormGroup;
    processing$ = new BehaviorSubject(false);
    submitted = false;
    unexpectedSubmissionError$ = new BehaviorSubject(false);
    @ViewChild('verifyAddressModal') private readonly _verifyAddressModal: SxmUiModalComponent;
    private _skipAddressValidationOnSuggestionAccept = false;
    private _avsValidated = false;
    private readonly _addressSuggestionsViewModel$ = new BehaviorSubject<{ correctedAddresses: any[]; addressCorrectionAction: any }>({
        correctedAddresses: [],
        addressCorrectionAction: null,
    });
    verifyAddressesDataViewModel$: Observable<any>;
    accountInfoFormModalAriaDescribedbyTextId = uuid();

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
            this._translateService.stream(`${this.translateKeyPrefix}.CONFIRM_YOUR_ADDRESS`),
        ]).pipe(
            map(([viewModel, headingText]) => ({
                ...viewModel,
                headingText,
                currentAddress: { ...this.form.controls.serviceAddress.value },
            }))
        );
    }

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            firstName: [null, { validators: this._sxmValidators.namePiece, updateOn: 'blur' }],
            lastName: [null, { validators: this._sxmValidators.namePiece, updateOn: 'blur' }],
            phoneNumber: [null, { validators: this._sxmValidators.phoneNumber, updateOn: 'blur' }],
            email: [null, { validators: this._sxmValidators.email, updateOn: 'blur' }],
            serviceAddress: null,
            country: ['US', this._sxmValidators.countryCode],
        });
    }

    ngAfterViewInit(): void {
        if (this.initialState) {
            const { firstName, lastName, phoneNumber, email, serviceAddress } = this.initialState;
            this.form.patchValue({ firstName, lastName, phoneNumber, email, serviceAddress, ...(serviceAddress?.country ? { country: serviceAddress?.country } : {}) });
            this._changeDetectorRef.detectChanges();
        }
    }

    setProcessingCompleted(): void {
        this.processing$.next(false);
        this._changeDetectorRef.detectChanges();
    }

    showUnexpectedSubmissionError(): void {
        this.unexpectedSubmissionError$.next(true);
        this._changeDetectorRef.detectChanges();
    }

    clearUnexpectedSubmissionError(): void {
        this.unexpectedSubmissionError$.next(false);
        this._changeDetectorRef.detectChanges();
    }

    showEmailInUseError(): void {
        this.form.get('email').setErrors({ emailInUse: true });
        this._changeDetectorRef.detectChanges();
    }

    showEmailNotAllowedError() {
        // We are going to use the generic error message in the scenario where email address is not allowed
        this.form.get('email').setErrors({ required: true });
        this._changeDetectorRef.detectChanges();
    }

    onEditExistingAddress() {
        this._skipAddressValidationOnSuggestionAccept = false;
        this._verifyAddressModal.close();
    }

    onUseAddressFromValidation(correctedAddress) {
        this._updateAddress(correctedAddress);
        this._skipAddressValidationOnSuggestionAccept = true;
        this.submitInfo();
        this._verifyAddressModal.close();
    }

    private _updateAddress(address) {
        this.form.get('serviceAddress').patchValue({ ...address }, { emitEvent: false });
    }

    submitInfo(): void {
        this.form.markAllAsTouched();
        this.processing$.next(true);
        this.submitted = true;
        this.unexpectedSubmissionError$.next(false);
        if (this.form.valid) {
            this._validatePaymentInfoWorkflowService
                .build({ paymentInfo: this.form.value.serviceAddress, skipAddressValidation: this._skipAddressValidationOnSuggestionAccept })
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
                        const { firstName, lastName, email, phoneNumber, serviceAddress, country } = this.form.value;
                        this.formCompleted.next({ firstName, lastName, email, phoneNumber, serviceAddress: { ...serviceAddress, country, avsValidated: this._avsValidated } });
                    },
                    error: () => {
                        // TODO: show system error message
                        this.processing$.next(false);
                    },
                });
        } else {
            const errors = [];
            if (this.form.get('firstName').errors) {
                errors.push('Account - Missing or invalid first name');
            }
            if (this.form.get('lastName').errors) {
                errors.push('Account - Missing or invalid last name');
            }
            if (this.form.get('phoneNumber').errors) {
                errors.push('Account - Missing or invalid phone number');
            }
            if (this.form.get('email').errors) {
                errors.push('Account - Missing or invalid email address');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this.processing$.next(false);
        }
    }
}

@NgModule({
    declarations: [AccountInfoFormComponent],
    exports: [AccountInfoFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiModalModule,
        DomainsCustomerUiVerifyAddressModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiFormsUiFirstNameFormFieldModule,
        SharedSxmUiUiLastNameFormFieldModule,
        SharedSxmUiUiEmailFormFieldModule,
        SharedSxmUiUiPhoneNumberFormFieldModule,
        SharedSxmUiUiAddressFormFieldsModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiDataClickTrackModule,
    ],
})
export class AccountInfoFormComponentModule {}
