import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { SharedSxmUiUiAddressFormFieldsModule, SxmUiAddressComponentApi } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { SharedSxmUiFormsUiFirstNameFormFieldModule } from '@de-care/shared/sxm-ui/forms/ui-first-name-form-field';
import { SharedSxmUiUiLastNameFormFieldModule } from '@de-care/shared/sxm-ui/ui-last-name-form-field';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-phone-number-form-field';
import { SharedSxmUiUiEmailFormFieldModule } from '@de-care/shared/sxm-ui/ui-email-form-field';
import { SharedSxmUiUiCheckboxWithLabelFormFieldModule } from '@de-care/shared/sxm-ui/ui-checkbox-with-label-form-field';
import { ToastNotificationService } from '@de-care/shared/sxm-ui/ui-toast-notification';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import {
    getAccountContactInfoDetails,
    UpdateAccountContactInfoWorkflowService,
    ValidateServiceAddressWorkflowWorkflowError,
    ValidateServiceAddressWorkflowService,
} from '@de-care/de-care-use-cases/account/state-my-account-account-info';
import { takeUntil, map, tap, catchError } from 'rxjs/operators';
import { Subject, BehaviorSubject, combineLatest, throwError } from 'rxjs';
import { SharedSxmUiUiModalModule, SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { SxmUiVerifyAddressComponentModule } from '@de-care/shared/sxm-ui/ui-verify-address';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import * as uuid from 'uuid/v4';

export interface ContactInfoDetailsModel {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    billingAddressSameAsService: boolean;
    serviceAddress: Address;
}

export interface Address {
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'my-account-edit-contact-info-page',
    templateUrl: './edit-contact-info-page.component.html',
    styleUrls: ['./edit-contact-info-page.component.scss'],
    standalone: true,
    imports: [
        TranslateModule,
        CommonModule,
        SharedSxmUiUiAddressFormFieldsModule,
        SharedSxmUiFormsUiFirstNameFormFieldModule,
        SharedSxmUiUiLastNameFormFieldModule,
        SharedSxmUiUiPhoneNumberFormFieldModule,
        SharedSxmUiUiEmailFormFieldModule,
        SharedSxmUiUiCheckboxWithLabelFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        SharedSxmUiUiModalModule,
        SxmUiVerifyAddressComponentModule,
    ],
})
export class EditContactInfoPageComponent implements ComponentWithLocale, AfterViewInit, OnInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    editContactInfoServerError = false;
    submitted = false;
    showInvalidContactInfoError = false;
    showInvalidServiceAddressError = false;
    editContactInfoForm: FormGroup;
    @ViewChild('serviceAddress') private _serviceAddressComponent: SxmUiAddressComponentApi;
    @ViewChild('editServiceAddressModal') private readonly _editServiceAddressModal: SxmUiModalComponent;

    private _destroy$: Subject<boolean> = new Subject<boolean>();

    private _skipAddressValidationOnSuggestionAccept = false;
    private _avsValidated = false;
    private readonly _window: Window;
    private readonly _addressSuggestionsViewModel$ = new BehaviorSubject<{ correctedAddresses: any[]; addressCorrectionAction: any }>({
        correctedAddresses: [],
        addressCorrectionAction: null,
    });
    verifyAddressesDataViewModel$ = null;
    editContactInfoModalAriaDescribedbyTextId = uuid();

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        @Inject(DOCUMENT) private readonly _document: Document,
        private readonly _toastNotificationService: ToastNotificationService,
        private readonly _updateAccountContactInfoWorkflowService: UpdateAccountContactInfoWorkflowService,
        private readonly _formBuilder: FormBuilder,
        private readonly _sxmValidators: SxmValidators,
        private readonly _router: Router,
        private readonly _store: Store,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _validateServiceAddressWorkflowService: ValidateServiceAddressWorkflowService
    ) {
        translationsForComponentService.init(this);
        this.editContactInfoForm = this._formBuilder.group({
            firstName: new FormControl(null, { validators: this._sxmValidators.namePiece, updateOn: 'blur' }),
            lastName: new FormControl(null, { validators: this._sxmValidators.namePiece, updateOn: 'blur' }),
            phoneNumber: new FormControl(null, { validators: this._sxmValidators.phoneNumber, updateOn: 'blur' }),
            email: new FormControl(null, { validators: this._sxmValidators.email, updateOn: 'blur' }),
            serviceAddress: [''],
            billingAddressSame: true,
        });
        this._window = this._document && this._document.defaultView;
    }

    ngOnInit(): void {
        this.verifyAddressesDataViewModel$ = combineLatest([
            this._addressSuggestionsViewModel$,
            this.translationsForComponentService.instant(`${this.translateKeyPrefix}.CONFIRM_YOUR_ADDRESS`),
        ]).pipe(
            map(([viewModel, headingText]) => ({
                ...viewModel,
                headingText,
                currentAddress: { ...this.editContactInfoForm.controls.serviceAddress.value },
            }))
        );
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'editcontactinfo' }));
        this._store
            .pipe(select(getAccountContactInfoDetails))
            .pipe(takeUntil(this._destroy$))
            .subscribe((contactInfoDetails: any) => {
                this.editContactInfoForm.patchValue({
                    firstName: contactInfoDetails.firstName,
                    lastName: contactInfoDetails.lastName,
                    phoneNumber: contactInfoDetails.phoneNumber,
                    email: contactInfoDetails.email,
                    billingAddressSame: contactInfoDetails.billingAddressSameAsService,
                    serviceAddress: {
                        ...contactInfoDetails.serviceAddress,
                        addressLine1: contactInfoDetails.serviceAddress?.streetAddress,
                        zip: contactInfoDetails.serviceAddress?.postalCode,
                    },
                });
            });
    }

    onBack(): void {
        this._window.history.back();
    }

    editContactInfoFormSubmit(): void {
        this.editContactInfoServerError = false;
        if (this.editContactInfoForm.valid) {
            const validateServiceAddressRequest = {
                serviceAddress: {
                    addressLine1: this.editContactInfoForm.controls.serviceAddress.value.addressLine1,
                    city: this.editContactInfoForm.controls.serviceAddress.value.city,
                    state: this.editContactInfoForm.controls.serviceAddress.value.state,
                    zip: this.editContactInfoForm.controls.serviceAddress.value.zip,
                    avsValidated: this._avsValidated,
                },
                skipAddressValidation: this._skipAddressValidationOnSuggestionAccept,
            };

            this._validateServiceAddressWorkflowService
                .build(validateServiceAddressRequest)
                .pipe(
                    tap((result) => {
                        if (result?.correctedAddress) {
                            const { avsValidated, ...address } = result.correctedAddress;
                            this._avsValidated = avsValidated;
                            this._editServiceAddress(address);
                        }
                    }),
                    catchError((error: ValidateServiceAddressWorkflowWorkflowError) => {
                        switch (error?.status) {
                            case 'ADDRESS_CONFIRMATION_NEEDED': {
                                this._skipAddressValidationOnSuggestionAccept = !error.validated;
                                this._addressSuggestionsViewModel$.next({
                                    correctedAddresses: error.correctedAddresses,
                                    addressCorrectionAction: error.addressCorrectionAction,
                                });
                                this._editServiceAddressModal.open();
                                return throwError(error.status);
                            }
                        }
                        return throwError(error);
                    })
                )
                .subscribe({
                    next: () => {
                        this._updateContactInfo();
                    },
                    error: () => {
                        this.editContactInfoServerError = true;
                        this._changeDetectorRef.detectChanges();
                    },
                });
        } else {
            this.editContactInfoServerError = true;
            this._changeDetectorRef.detectChanges();
        }
    }

    onEditExistingAddress() {
        this._skipAddressValidationOnSuggestionAccept = false;
        this._editServiceAddressModal.close();
    }

    onUseAddressFromValidation(correctedAddress) {
        this._editServiceAddress(correctedAddress);
        this._skipAddressValidationOnSuggestionAccept = true;
        this.editContactInfoFormSubmit();
        this._editServiceAddressModal.close();
    }

    onCancel() {
        this.submitted = false;
        this.clearForm();
        this._window.history.back();
    }

    clearForm() {
        this.editContactInfoServerError = false;
        this.editContactInfoForm.markAsUntouched();
        this.editContactInfoForm.reset();
    }

    private _updateContactInfo(): void {
        this.editContactInfoServerError = false;
        if (this.editContactInfoForm.valid) {
            const contactInfoDetails: ContactInfoDetailsModel = {
                firstName: this.editContactInfoForm.controls.firstName.value,
                lastName: this.editContactInfoForm.controls.lastName.value,
                phoneNumber: this.editContactInfoForm.controls.phoneNumber.value,
                email: this.editContactInfoForm.controls.email.value,
                billingAddressSameAsService: this.editContactInfoForm.controls.billingAddressSame.value,
                serviceAddress: {
                    addressLine1: this.editContactInfoForm.controls.serviceAddress.value.addressLine1,
                    city: this.editContactInfoForm.controls.serviceAddress.value.city,
                    state: this.editContactInfoForm.controls.serviceAddress.value.state,
                    zipCode: this.editContactInfoForm.controls.serviceAddress.value.zip,
                },
            };

            this._updateAccountContactInfoWorkflowService.build(contactInfoDetails).subscribe(
                () => {
                    this._window.history.back();
                    this._toastNotificationService.showNotification(
                        this.translationsForComponentService.instant(`${this.translateKeyPrefix}.CONTACT_INFO_UPDATE_SUCCESS_MESAGE`)
                    );
                },
                (error: any) => {
                    this.editContactInfoServerError = true;
                    this._changeDetectorRef.detectChanges();
                }
            );
        } else {
            this.editContactInfoServerError = true;
            this._changeDetectorRef.detectChanges();
        }
    }

    private _editServiceAddress(address): void {
        this.editContactInfoForm.controls.serviceAddress.patchValue({ ...address }, { emitEvent: true });
    }
}
