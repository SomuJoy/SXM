import { Component, EventEmitter, Output, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BillingAddress } from '../../data-models/billing-address';
import { VerifyAddressData } from '@de-care/customer-info';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AddressCorrectionAction, AddressValidationService, AddressValidationStateAddress, DataValidationService } from '@de-care/data-services';
import { controlIsInvalid } from '@de-care/shared/validation';
import { SettingsService } from '@de-care/settings';
import { AddressFormFieldsOemComponent, AddressFormFieldsOemComponentApi, AddressFormFieldsOem } from '@de-care/shared/sxm-ui/ui-address-form-fields';

@Component({
    selector: 'billing-address-step',
    templateUrl: './billing-address-step.component.html',
    styleUrls: ['./billing-address-step.component.scss']
})
export class BillingAddressStepComponent implements OnChanges {
    @Input() hasEmailAddress: boolean;
    @Output() submitted = new EventEmitter<BillingAddress>();
    @ViewChild(AddressFormFieldsOemComponent) addressFormFieldsOem: AddressFormFieldsOemComponentApi;

    addressVerificationData: VerifyAddressData;
    needsConfirmation = false;
    validated: boolean;
    submitting = false;
    hasBeenSubmitted = false;
    email: FormControl;

    controlIsInvalid = controlIsInvalid(() => {
        return this.hasBeenSubmitted;
    });

    constructor(
        private _addressValidationService: AddressValidationService,
        private _dataValidationService: DataValidationService,
        private _titleService: Title,
        private _translateService: TranslateService,
        private _settingsService: SettingsService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasEmailAddress && changes.hasEmailAddress.currentValue !== true) {
            this.email = new FormControl('', {
                validators: [Validators.required, Validators.email],
                updateOn: 'blur'
            });
        }
    }

    checkAddress(addressForm: FormGroup) {
        this.submitting = true;
        this.hasBeenSubmitted = true;
        if (addressForm.valid) {
            if (!this._stateIsValid(addressForm.get('state').value)) {
                addressForm.get('state').setErrors({ notFound: true });
                this.submitting = false;
                return;
            }
            const addressFormData = this.addressFormFieldsOem.getFormData();
            if (!this.hasEmailAddress) {
                this._dataValidationService.validateCustomerInfo({ email: { email: this.email.value } }).subscribe(response => {
                    if (!response.emailValidation.valid) {
                        this.email.setErrors({ email: true });
                        this.submitting = false;
                        return false;
                    } else {
                        this.validateAddress(addressFormData);
                    }
                });
            } else {
                this.validateAddress(addressFormData);
            }
        } else {
            addressForm.markAllAsTouched();
            this.submitting = false;
        }
    }

    validateAddress(addressFormData: AddressFormFieldsOem): void {
        this._addressValidationService
            .validateAddresses({
                billingAddress: {
                    addressLine1: addressFormData.addressLine1,
                    addressLine2: addressFormData.addressLine2,
                    city: addressFormData.city,
                    state: addressFormData.state,
                    zip: addressFormData.zip
                }
            })
            .subscribe(addressValidationResponse => {
                this.validated = addressValidationResponse.billingAddress.validated;
                this.addressVerificationData = {
                    correctedAddresses: addressValidationResponse.billingAddress.correctedAddresses || null,
                    currentAddress: {
                        addressLine1: addressFormData.addressLine2 ? `${addressFormData.addressLine1} ${addressFormData.addressLine2}` : addressFormData.addressLine1,
                        city: addressFormData.city,
                        state: addressFormData.state,
                        zip: addressFormData.zip
                    },
                    headingText: null,
                    addressCorrectionAction: addressValidationResponse.billingAddress.addressCorrectionAction
                };
                this.needsConfirmation = !this.validated || addressValidationResponse.billingAddress.addressCorrectionAction === AddressCorrectionAction.Suggest;
                if (this.needsConfirmation) {
                    this._titleService.setTitle(`SiriusXM - ${this._translateService.instant('oemCommon.oemFlowComponent.STEP_PAGE_TITLES.ADDRESS_CONFIRMATION_STEP')}`);
                    this.submitting = false;
                } else {
                    this._submitAddress({
                        // TODO: Update this to support multiple corrected address results
                        addressLine1: addressValidationResponse.billingAddress.correctedAddresses[0].addressLine1,
                        city: addressValidationResponse.billingAddress.correctedAddresses[0].city,
                        state: addressValidationResponse.billingAddress.correctedAddresses[0].state,
                        zip: addressValidationResponse.billingAddress.correctedAddresses[0].zip,
                        country: this._settingsService.settings.country.toUpperCase(),
                        avsvalidated: true,
                        email: this.email ? this.email.value : null
                    });
                }
            });
    }

    setAddressAndContinue(address: AddressValidationStateAddress) {
        this._submitAddress({
            addressLine1: address.addressLine1,
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: this._settingsService.settings.country.toUpperCase(),
            avsvalidated: this.validated,
            email: this.email ? this.email.value : null
        });
    }

    enterNewAddress() {
        this.needsConfirmation = false;
        this._titleService.setTitle(`SiriusXM - ${this._translateService.instant('oemCommon.oemFlowComponent.STEP_PAGE_TITLES.BILLING_ADDRESS_STEP')}`);
    }

    private _submitAddress(billingAddress: BillingAddress) {
        this.needsConfirmation = false;
        this.submitted.emit(billingAddress);
        this.submitting = false;
    }

    private _stateIsValid(state: string): boolean {
        return !!this._translateService.instant('app.areas').find((area: { label: string; key: string }) => area.key.toUpperCase() === state.toUpperCase());
    }
}
