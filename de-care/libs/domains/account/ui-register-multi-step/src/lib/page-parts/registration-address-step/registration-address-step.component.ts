import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressCorrectionAction, AddressValidationStateAddress, CustomerValidationAddressesWorkFlowService } from '@de-care/domains/customer/state-customer-verification';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { sxmCountries } from '@de-care/shared/state-settings';
import { AddressFormFieldsComponent } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { SxmLanguages } from '@de-care/shared/translation';
import { getSxmValidator } from '@de-care/shared/validation';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, startWith, take, takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

export interface FlepzData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    zipCode: string;
}

export interface AddressAndPhone {
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
    avsvalidated: boolean;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

@Component({
    selector: 'registration-address-step',
    templateUrl: './registration-address-step.component.html',
    styleUrls: ['./registration-address-step.component.scss'],
})
export class RegistrationAddressStepComponent implements OnInit, OnDestroy {
    addressSuggestionIsAvsValidated$ = new BehaviorSubject(false);
    addressSuggestionsViewModel$ = new BehaviorSubject<{ correctedAddresses: AddressValidationStateAddress[]; addressCorrectionAction: AddressCorrectionAction }>({
        correctedAddresses: [],
        addressCorrectionAction: null,
    });
    translateKeyPrefix = 'DomainsAccountUiRegisterMultiStepModule.RegistrationAddressStepComponent.';
    form: FormGroup;
    serviceAddressFormSubmitted = false;
    serviceAddressFormProcessing$ = new BehaviorSubject(false);
    serviceAddressGenericError = false;
    verifyAddressesDataViewModel$;
    @Input() flepzData: FlepzData;
    @Input() country: sxmCountries;
    @Output() stepCompleted = new EventEmitter<AddressAndPhone>();
    @ViewChild(AddressFormFieldsComponent) private readonly _AddressFormFieldsComponent: AddressFormFieldsComponent;
    @ViewChild('verifyAddressModal') private readonly _verifyAddressModal: SxmUiModalComponent;
    private readonly _unsubscribe: Subject<void> = new Subject();
    registrationAddressStepModalAriaDescribedbyTextId = uuid();

    constructor(
        private readonly _store: Store,
        private readonly _customerValidationAddressesWorkFlowService: CustomerValidationAddressesWorkFlowService,
        private readonly _formBuilder: FormBuilder,
        private readonly _translateService: TranslateService
    ) {}

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            serviceAddress: this._formBuilder.control(''),
            firstName: [
                this.flepzData?.firstName,
                {
                    validators: Validators.required,
                    updateOn: 'blur',
                },
            ],
            lastName: [
                this.flepzData?.lastName,
                {
                    validators: Validators.required,
                    updateOn: 'blur',
                },
            ],
            email: [
                this.flepzData?.email,
                {
                    validators: Validators.required,
                    updateOn: 'blur',
                },
            ],
            phoneNumber: [
                this.flepzData?.phoneNumber,
                {
                    validators: Validators.required,
                    updateOn: 'blur',
                },
            ],
        });
        this._translateService.onLangChange.pipe(startWith(this._translateService.currentLang), takeUntil(this._unsubscribe)).subscribe((lang: SxmLanguages) => {
            this.form.controls.email.setValidators(getSxmValidator('email', this.country, lang));
        });
        this.verifyAddressesDataViewModel$ = combineLatest([
            this.addressSuggestionsViewModel$,
            this._translateService.stream(`${this.translateKeyPrefix}CONFIRM_YOUR_ADDRESS`),
        ]).pipe(
            map(([viewModel, headingText]) => ({
                ...viewModel,
                headingText,
                currentAddress: { ...this.form.controls.serviceAddress.value },
            }))
        );
    }

    onSubmit() {
        this.form.markAllAsTouched();
        this.serviceAddressFormSubmitted = true;
        this.serviceAddressFormProcessing$.next(true);
        if (this.form.valid) {
            const payload = { serviceAddress: null };
            payload.serviceAddress = this.form.value.serviceAddress;
            this._customerValidationAddressesWorkFlowService.build(payload).subscribe({
                next: ({ serviceAddress }) => {
                    const correctedAddressExists = Array.isArray(serviceAddress?.correctedAddresses) && serviceAddress?.correctedAddresses.length > 0;
                    if (serviceAddress?.addressCorrectionAction === AddressCorrectionAction.AutoCorrect && correctedAddressExists) {
                        if (serviceAddress?.correctedAddresses[0]) {
                            this._updateServiceAddress({ ...serviceAddress?.correctedAddresses[0] });
                        }
                        this.serviceAddressFormProcessing$.next(false);
                        this._emitCompletedData(serviceAddress?.validated);
                    } else {
                        this.addressSuggestionIsAvsValidated$.next(serviceAddress?.validated);
                        this.addressSuggestionsViewModel$.next({
                            correctedAddresses: serviceAddress?.correctedAddresses,
                            addressCorrectionAction: serviceAddress?.addressCorrectionAction,
                        });

                        this._verifyAddressModal.open();
                        this.serviceAddressFormProcessing$.next(false);
                        return { validated: false };
                    }
                },
                error: () => {
                    this.serviceAddressGenericError = true;
                    this.serviceAddressFormProcessing$.next(false);
                },
            });
        } else {
            const errors: string[] = [];
            if (this._AddressFormFieldsComponent?.addressForm?.get('addressLine1').errors) {
                errors.push('Registration - Missing street address');
            }
            if (this._AddressFormFieldsComponent?.addressForm?.get('city').errors) {
                errors.push('Registration - Missing city');
            }
            if (this._AddressFormFieldsComponent?.addressForm?.get('state').errors) {
                errors.push('Registration - Missing state');
            }
            if (this._AddressFormFieldsComponent?.addressForm?.get('zip').errors) {
                errors.push('Registration - Missing or invalid zip code');
            }
            if (this.form.get('phoneNumber').errors) {
                errors.push('Registration - Missing or invalid phone number');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this.serviceAddressFormProcessing$.next(false);
        }
    }

    private _updateServiceAddress(correctedAddress) {
        this.form.controls.serviceAddress.patchValue(correctedAddress, { emitEvent: false });
    }

    proceedWithCorrectedAddress(correctedAddress) {
        this._updateServiceAddress(correctedAddress);
        this.addressSuggestionIsAvsValidated$.pipe(take(1)).subscribe((avsvalidated) => {
            this._emitCompletedData(avsvalidated);
        });
    }

    private _emitCompletedData(avsvalidated: boolean): void {
        this.stepCompleted.next({
            ...this.form.value.serviceAddress,
            avsvalidated,
            firstName: this.form.value.firstName,
            lastName: this.form.value.lastName,
            email: this.form.value.email,
            phoneNumber: this.form.value.phoneNumber,
        });
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
}
