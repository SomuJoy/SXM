import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as uuid from 'uuid/v4';
import { sxmCountries } from '@de-care/settings';
import { SxmLanguages } from '@de-care/app-common';
import { getSxmValidator } from '@de-care/shared/validation';
import { LoginFormInfo } from '@de-care/domains/account/ui-login-form-fields';
import { SxmUiAddressComponentApi } from '@de-care/shared/sxm-ui/ui-address-form-fields';

export interface NewAccountFormFieldsComponentApi {
    clearForm: () => void;
    setFocusOnServiceAddress: () => void;
    firstName: AbstractControl;
    lastName: AbstractControl;
}

export interface AccountData {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    addressLine1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    password?: string;
    username: string;
    avsValidated?: boolean;
}

@Component({
    selector: 'new-account-form-fields',
    templateUrl: './new-account-form-fields.component.html',
    styleUrls: ['./new-account-form-fields.component.scss'],
    exportAs: 'newAccountFormFields',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewAccountFormFieldsComponent implements OnInit, OnChanges, NewAccountFormFieldsComponentApi {
    @Input() parentFormGroup: FormGroup;
    @Input() set prospectData(prospectData: AccountData) {
        if (prospectData) {
            this.prefillData = prospectData;
        } else {
            this.prefillData = null;
        }
    }

    @Input() country: sxmCountries = 'us';
    @Input() lang: SxmLanguages = 'en-US';
    @Input() canEditUsername = false;
    @Input() isLoadingExternally = false;
    @Input() hasExternalError = false;
    @Input() submitted = false;
    @Input() isStreamingFlow = false;
    @Input() reducedFields = false;
    @Input() invalidZipFromLookup = false;
    @Input() passwordError: boolean;

    newAccountForm: FormGroup;
    isCanada: boolean;
    isQuebec: boolean = false;
    isLoading: boolean = false;
    emailControlName = 'email';
    passwordControlName = 'password';

    readonly firstNameId = uuid();
    readonly lastNameId = uuid();
    readonly phoneNumberId = uuid();

    prefillData: AccountData;
    loginFormInfo: LoginFormInfo;
    showInvalidAddressError = false;
    unexpectedError = false;
    @ViewChild('serviceAddress') private _serviceAddressComponent: SxmUiAddressComponentApi;

    get firstName() {
        return this.newAccountForm?.controls.firstName;
    }
    get lastName() {
        return this.newAccountForm?.controls.lastName;
    }

    constructor(private _formBuilder: FormBuilder) {}

    ngOnInit() {
        if (this.prefillData && this.prefillData.country) {
            this.country = this.prefillData.country as sxmCountries;
        }
        this.isCanada = this.country === 'ca';
        this._genNewAccountForm();
        this._genLoginFormInfo();
        this._setDynamicValidators();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.lang || changes.country) {
            this._setDynamicValidators();
        }
        if (changes.prospectData && changes.prospectData.previousValue) {
            if (this.prefillData && this.prefillData.country) {
                this.country = this.prefillData.country as sxmCountries;
            }
            this.isCanada = this.country === 'ca';
            this.newAccountForm.get('country').setValue(this.country);
            this._genLoginFormInfo();
            this._setDynamicValidators();
        }
    }

    clearForm(): void {
        if (this._serviceAddressComponent) {
            this._serviceAddressComponent.clearForm();
        }
        this.newAccountForm.reset();
    }

    setFocusOnServiceAddress(): void {
        if (this._serviceAddressComponent) {
            this._serviceAddressComponent.setFocus();
        }
    }

    private _genNewAccountForm(): void {
        this.newAccountForm = this._formBuilder.group({
            firstName: [(this.prefillData && this.prefillData.firstName) || ''],
            lastName: [(this.prefillData && this.prefillData.lastName) || ''],
            phoneNumber: [
                null,
                {
                    validators: getSxmValidator('phoneNumber'),
                    updateOn: 'blur',
                },
            ],
            ...(this.reducedFields && {
                serviceAddress: [
                    {
                        zip: (this.prefillData && this.prefillData.postalCode) || null,
                    },
                ],
            }),
            ...(!this.reducedFields && {
                serviceAddress: [
                    {
                        addressLine1: (this.prefillData && this.prefillData.addressLine1) || null,
                        city: (this.prefillData && this.prefillData.city) || null,
                        state: (this.prefillData && this.prefillData.state) || null,
                        zip: (this.prefillData && this.prefillData.postalCode) || null,
                    },
                ],
            }),

            country: [(this.prefillData && this.prefillData.country) || this.country],
        });

        if (this.parentFormGroup.controls.accountInfo) {
            this.parentFormGroup.removeControl('accountInfo');
        }
        this.parentFormGroup.addControl('accountInfo', this.newAccountForm);
    }

    private _genLoginFormInfo() {
        if (this.prefillData && this.newAccountForm) {
            this.loginFormInfo = {
                email: this.prefillData?.username,
                canEditEmail: this.canEditUsername,
                parentForm: this.newAccountForm,
                passwordControlName: this.passwordControlName,
                emailControlName: this.emailControlName,
            };
        } else {
            this.loginFormInfo = null;
        }
    }

    private _setDynamicValidators(updateValueAndValidities: boolean = false) {
        if (this.newAccountForm) {
            const firstName = this.newAccountForm.get('firstName');
            const lastName = this.newAccountForm.get('lastName');
            const serviceAddress = this.newAccountForm.controls.serviceAddress;
            const zip = this.newAccountForm.get('zip');

            firstName.setValidators(getSxmValidator('firstName', this.country, this.lang));
            lastName.setValidators(getSxmValidator('lastName', this.country, this.lang));
            zip && zip.setValidators(getSxmValidator('zipCode', this.country, this.lang));

            if (updateValueAndValidities) {
                firstName.updateValueAndValidity();
                lastName.updateValueAndValidity();
                serviceAddress.updateValueAndValidity();
                zip && zip.updateValueAndValidity();
            }
        }
    }
}
