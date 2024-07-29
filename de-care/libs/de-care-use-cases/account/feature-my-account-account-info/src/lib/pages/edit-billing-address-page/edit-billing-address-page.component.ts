import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
    getEditBillingAddressDetails,
    UpdateAccountBillingAddressInfoWorkflowService,
    ValidateBillingAddressWorkflowService,
    ValidateBillingAddressWorkflowWorkflowError,
} from '@de-care/de-care-use-cases/account/state-my-account-account-info';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiUiAddressFormFieldsModule, SxmUiAddressComponentApi } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { SharedSxmUiUiModalModule, SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { ToastNotificationService } from '@de-care/shared/sxm-ui/ui-toast-notification';
import { SxmUiVerifyAddressComponentModule } from '@de-care/shared/sxm-ui/ui-verify-address';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { select, Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

export interface BillingAddressDetailsModel {
    billingAddress: {
        addressLine1: string;
        city: string;
        state: string;
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
    selector: 'my-account-edit-billing-address-page',
    templateUrl: './edit-billing-address-page.component.html',
    styleUrls: ['./edit-billing-address-page.component.scss'],
    standalone: true,
    imports: [
        TranslateModule,
        CommonModule,
        SharedSxmUiUiAddressFormFieldsModule,
        FormsModule,
        ReactiveFormsModule,
        SharedSxmUiUiModalModule,
        SxmUiVerifyAddressComponentModule,
    ],
})
export class EditBillingAddressPageComponent implements ComponentWithLocale, OnInit, AfterViewInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    editBillingAddressServerError = false;
    submitted = false;
    loading = false;
    avsValidated: boolean;
    editBillingAddressForm: FormGroup;
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    private _skipAddressValidationOnSuggestionAccept = false;
    private _avsValidated = false;
    private readonly _window: Window;
    private readonly _addressSuggestionsViewModel$ = new BehaviorSubject<{ correctedAddresses: any[]; addressCorrectionAction: any }>({
        correctedAddresses: [],
        addressCorrectionAction: null,
    });
    verifyAddressesDataViewModel$ = null;
    editBillingAddressModalAriaDescribedbyTextId = uuid();

    @Output() submitEditBillingForm = new EventEmitter();
    @ViewChild('billingAddress') private _billingAddressComponent: SxmUiAddressComponentApi;
    @ViewChild('editBillingAddressModal') private readonly _editBillingAddressModal: SxmUiModalComponent;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        @Inject(DOCUMENT) private readonly _document: Document,
        private readonly _toastNotificationService: ToastNotificationService,
        private readonly formBuilder: FormBuilder,
        private readonly _updateAccountBillingAddressInfoWorkflowService: UpdateAccountBillingAddressInfoWorkflowService,
        private readonly _validateBillingAddressWorkflowService: ValidateBillingAddressWorkflowService,
        private _router: Router,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _store: Store
    ) {
        translationsForComponentService.init(this);
        this.editBillingAddressForm = this.formBuilder.group({
            billingAddress: [''],
        });
        this._window = this._document && this._document.defaultView;
    }

    ngOnInit(): void {
        this.verifyAddressesDataViewModel$ = this._addressSuggestionsViewModel$.pipe(
            map((viewModel) => ({
                ...viewModel,
                headingText: '',
                currentAddress: {
                    ...this.editBillingAddressForm.controls.billingAddress.value,
                },
            }))
        );
    }

    private toTitleCase(val: string): string {
        return val
            ? val
                  .toLowerCase()
                  .split(' ')
                  .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
                  .join(' ')
            : val;
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'editbillingaddress' }));
        this._store
            .pipe(select(getEditBillingAddressDetails))
            .pipe(takeUntil(this._destroy$))
            .subscribe((editBillingAddressDetails: any) => {
                const billingObj = {
                    addressLine1: this.toTitleCase(editBillingAddressDetails.billingAddress.addressLine1),
                    city: this.toTitleCase(editBillingAddressDetails.billingAddress.city),
                    state: editBillingAddressDetails.billingAddress.state,
                    zip: editBillingAddressDetails.billingAddress.zip,
                };
                this.editBillingAddressForm.patchValue({
                    billingAddress: billingObj,
                });
            });
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    onBack(): void {
        this._window.history.back();
    }

    editBillingAddressFormSubmit(): void {
        this.editBillingAddressServerError = false;
        if (this.editBillingAddressForm.valid) {
            this.loading = true;
            const validateBillingAddressRequest = {
                billingAddress: {
                    addressLine1: this.editBillingAddressForm.controls.billingAddress.value.addressLine1,
                    city: this.editBillingAddressForm.controls.billingAddress.value.city,
                    state: this.editBillingAddressForm.controls.billingAddress.value.state,
                    zip: this.editBillingAddressForm.controls.billingAddress.value.zip,
                    avsValidated: this._avsValidated,
                },
                skipAddressValidation: this._skipAddressValidationOnSuggestionAccept,
            };

            this._validateBillingAddressWorkflowService
                .build(validateBillingAddressRequest)
                .pipe(
                    tap((result) => {
                        if (result?.correctedAddress) {
                            const { avsValidated, ...address } = result.correctedAddress;
                            this._avsValidated = avsValidated;
                            this._editBillingAddress(address);
                        }
                    }),
                    catchError((error: ValidateBillingAddressWorkflowWorkflowError) => {
                        switch (error?.status) {
                            case 'ADDRESS_CONFIRMATION_NEEDED': {
                                this._skipAddressValidationOnSuggestionAccept = !error.validated;
                                this._addressSuggestionsViewModel$.next({
                                    correctedAddresses: error.correctedAddresses,
                                    addressCorrectionAction: error.addressCorrectionAction,
                                });
                                this._editBillingAddressModal.open();
                                return throwError(error.status);
                            }
                        }
                        return throwError(error);
                    })
                )
                .subscribe({
                    next: () => {
                        this._updateBillingAddressInfo();
                    },
                    error: () => {
                        this.loading = false;
                        this.editBillingAddressServerError = true;
                        this._changeDetectorRef.detectChanges();
                    },
                });
        } else {
            this.editBillingAddressServerError = true;
            this._changeDetectorRef.detectChanges();
        }
    }

    onEditExistingAddress() {
        this._skipAddressValidationOnSuggestionAccept = false;
        this._editBillingAddressModal.close();
    }

    onAcceptCorrectedAddress(correctedAddress) {
        this._editBillingAddress(correctedAddress);
        this._skipAddressValidationOnSuggestionAccept = true;
        this.editBillingAddressFormSubmit();
        this._editBillingAddressModal.close();
    }

    onCancel() {
        this.submitted = false;
        this.clearForm();
        this._window.history.back();
    }

    clearForm() {
        this.editBillingAddressServerError = false;
        this.editBillingAddressForm.markAsUntouched();
        this.editBillingAddressForm.reset();
    }

    private _updateBillingAddressInfo(): void {
        this.editBillingAddressServerError = false;
        if (this.editBillingAddressForm.valid) {
            const editBillingDetails: BillingAddressDetailsModel = {
                billingAddress: {
                    addressLine1: this.editBillingAddressForm.controls.billingAddress.value.addressLine1,
                    city: this.editBillingAddressForm.controls.billingAddress.value.city,
                    state: this.editBillingAddressForm.controls.billingAddress.value.state,
                    zipCode: this.editBillingAddressForm.controls.billingAddress.value.zip,
                },
            };

            this._updateAccountBillingAddressInfoWorkflowService.build(editBillingDetails).subscribe(
                () => {
                    this._window.history.back();
                    this._toastNotificationService.showNotification(
                        this.translationsForComponentService.instant(`${this.translateKeyPrefix}.BILLING_ADDRESS_UPDATE_SUCCESS_MESAGE`)
                    );
                },
                (error: any) => {
                    this.editBillingAddressServerError = true;
                    this._changeDetectorRef.detectChanges();
                }
            );
        } else {
            this.editBillingAddressServerError = true;
            this._changeDetectorRef.detectChanges();
        }
    }

    private _editBillingAddress(address): void {
        this.editBillingAddressForm.controls.billingAddress.patchValue({ ...address }, { emitEvent: true });
    }
}
