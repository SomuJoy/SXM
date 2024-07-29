import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SxmLanguages } from '@de-care/app-common';
import { getSxmValidator } from '@de-care/shared/validation';
import * as uuid from 'uuid/v4';
import { sxmCountries } from '@de-care/settings';
import {
    AddressCorrectionAction,
    AddressValidationService,
    AddressValidationStateAddress,
    ComponentNameEnum,
    CustomerValidation,
    DataLayerDataTypeEnum,
    ErrorTypeEnum,
    FlowNameEnum,
    ProspectModel,
} from '@de-care/data-services';
import { DataLayerService, FrontEndErrorEnum, FrontEndErrorModel } from '@de-care/data-layer';
import { AvsWorkflows, AvsWorkflowState, AddressVerificationStateService } from '@de-care/customer-info';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { setFocusOnInputField } from '@de-care/browser-common';
import { getIncludeActivationInstructions } from '@de-care/de-care-use-cases/trial-activation/state-legacy';
import { Store } from '@ngrx/store';

export interface AccountData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    password: string;
    username: string;
    avsValidated: boolean;
}

@Component({
    selector: 'new-account-form-step',
    templateUrl: './new-account-form-step.component.html',
    styleUrls: ['./new-account-form-step.component.scss'],
    providers: [AddressVerificationStateService],
})
export class NewAccountFormStepComponent implements OnInit, OnChanges, OnDestroy {
    @Input() set prospectData(prospectData: ProspectModel) {
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
    @Input() passwordPolicyIssue = false;

    @Output() submitNewAccount = new EventEmitter<AccountData>();

    agreementAccepted = false;
    agreement: FormControl;
    private _destroy$ = new Subject<boolean>();
    readonly contestMessageId = uuid();

    submitted = false;
    newAccountForm: FormGroup;
    isCanada: boolean;
    isQuebec: boolean = false;
    isLoading: boolean = false;
    emailControlName = 'email';
    passwordControlName = 'password';

    readonly firstNameId = uuid();
    readonly lastNameId = uuid();
    readonly phoneNumberId = uuid();
    readonly addressLine1Id = uuid();
    readonly cityId = uuid();
    readonly stateId = uuid();
    readonly postalCodeId = uuid();
    newAccFormModalAriaDescribedbyTextId = uuid();

    includeActivationInstructions$ = this._store.select(getIncludeActivationInstructions);
    prefillData: ProspectModel;
    showInvalidAddressError = false;
    unexpectedError = false;
    avsWorkflowState$: Observable<AvsWorkflowState>;
    private _avsValidated = false;
    @ViewChild('addressLine1Element', { static: true }) private _addressLine1Element: ElementRef;

    constructor(
        private _formBuilder: FormBuilder,
        private _dataLayerSrv: DataLayerService,
        private _addressValidationService: AddressValidationService,
        private _addressVerificationStateService: AddressVerificationStateService,
        private _changeDetectorRef: ChangeDetectorRef,
        private readonly _store: Store
    ) {}

    ngOnInit() {
        this.isCanada = this.country === 'ca';
        this._genNewAccountForm();
        this._setDynamicValidators();
        this._dataLayerSrv.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, ComponentNameEnum.CustomerInfo, {
            flowName: FlowNameEnum.TrialActivation,
            componentName: ComponentNameEnum.CustomerInfo,
        });
        this._initAddressValidation();
        if (this.isCanada) {
            this._addAgreementControl();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.lang || changes.country) {
            this._setDynamicValidators();
        }
        if (this.passwordPolicyIssue) {
            this.newAccountForm.controls['password'].setErrors({ generic: true });
        }
    }

    sendForm(): void {
        this.submitted = true;
        this.isLoading = true;
        this.showInvalidAddressError = false;
        if (this.newAccountForm.valid) {
            this._validateAddress(this._getAddress(this.newAccountForm.value));
        } else {
            this._logErrorsToDataLayer();
            this.isLoading = false;
        }
    }

    private _logErrorsToDataLayer() {
        if (this.newAccountForm.get('firstName').errors) {
            this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingFirstName));
        }
        if (this.newAccountForm.get('lastName').errors) {
            this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingLastName));
        }
        if (this.newAccountForm.get('phoneNumber').errors) {
            this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingPhone));
        }
        if (this.newAccountForm.get('addressLine1').errors) {
            this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.CheckoutMissingAddress));
        }
        if (this.newAccountForm.get('city').errors) {
            this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.CheckoutMissingCity));
        }
        if (this.newAccountForm.get('state').errors) {
            this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.CheckoutMissingState));
        }
        if (this.newAccountForm.get('postalCode').errors) {
            this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.CheckoutMissingZipCode));
        }
        if (this.newAccountForm.get('email') && this.newAccountForm.get('email').errors) {
            this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.GeneralMissingOrInvalidEmail));
        }
        if (this.newAccountForm.get('password') && this.newAccountForm.get('password').errors) {
            this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingPassword));
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
            addressLine1: [null],
            city: [null],
            country: [this.country],
            state: [null],
            postalCode: [(this.prefillData && this.prefillData.zipCode) || null],
        });
    }

    private _setDynamicValidators(updateValueAndValidities: boolean = false) {
        if (this.newAccountForm) {
            const firstName = this.newAccountForm.get('firstName');
            const lastName = this.newAccountForm.get('lastName');
            const addressLine1 = this.newAccountForm.get('addressLine1');
            const city = this.newAccountForm.get('city');
            const postalCode = this.newAccountForm.get('postalCode');
            const state = this.newAccountForm.get('state');

            firstName.setValidators(getSxmValidator('firstName', this.country, this.lang));
            lastName.setValidators(getSxmValidator('lastName', this.country, this.lang));
            addressLine1.setValidators(getSxmValidator('address', this.country, this.lang));
            city.setValidators(getSxmValidator('city', this.country, this.lang));
            postalCode.setValidators(getSxmValidator('zipCode', this.country, this.lang));
            state.setValidators(getSxmValidator('province', this.country, this.lang));

            if (updateValueAndValidities) {
                firstName.updateValueAndValidity();
                lastName.updateValueAndValidity();
                addressLine1.updateValueAndValidity();
                city.updateValueAndValidity();
                postalCode.updateValueAndValidity();
                state.updateValueAndValidity();
            }
        }
    }

    onAcceptCorrectedAddress(address, validated: boolean, avsWorkflow: AvsWorkflows) {
        if (avsWorkflow === 'SERVICE_ADDRESS_MODAL') {
            this._editAddress(address, validated);
            this.showInvalidAddressError = false;
            this._addressVerificationStateService.correctedServiceAddressAccepted();
        }
    }

    onEditExistingAddress(avsWorkflow: AvsWorkflows) {
        this._addressVerificationStateService.setAvsToEditAddressMode(avsWorkflow);
    }

    // TODO: see about encapsulating logic from _initAddressValidation and _validateAddress
    //       either into the VerifyAddressComponent or a service to make it easier to wire up
    //       and re-use address validation (and update PaymentInfoComponent too)
    private _initAddressValidation() {
        this.avsWorkflowState$ = this._addressVerificationStateService.avsWorkflowState$.pipe(
            tap((avsWorkflowState: AvsWorkflowState) => {
                this.showInvalidAddressError = false;
                switch (avsWorkflowState.currentWorkflow) {
                    case 'EDIT_SERVICE_ADDRESS': {
                        this.showInvalidAddressError = avsWorkflowState.hasError;
                        setFocusOnInputField(this._addressLine1Element);
                        break;
                    }
                    case 'COMPLETED': {
                        this.isLoading = false;

                        if (this.newAccountForm.valid) {
                            this._completeStep();
                        }
                        break;
                    }
                }
            })
        );
    }

    private _validateAddress(address) {
        const validateAddressesPayload: CustomerValidation = {
            serviceAddress: address,
        };
        // tslint:disable deprecation
        this._addressValidationService.validateAddresses(validateAddressesPayload).subscribe({
            // tslint:enable deprecation
            next: ({ serviceAddress }) => {
                const { validated, addressCorrectionAction, correctedAddresses } = serviceAddress;
                const avsState = {
                    serviceAddress: serviceAddress
                        ? {
                              currentAddress: address,
                              correctedAddresses,
                              validated,
                              addressCorrectionAction,
                          }
                        : null,
                };
                if (serviceAddress && addressCorrectionAction === AddressCorrectionAction.AutoCorrect) {
                    this._editAddress(correctedAddresses[0], validated);
                    avsState.serviceAddress = null;
                }
                this._addressVerificationStateService.setAvsInitialState(avsState);
            },
            error: () => {
                this.unexpectedError = true;
                this.isLoading = false;
                this._changeDetectorRef.markForCheck();
            },
        });
    }

    private _completeStep() {
        const accountData = { ...(this.newAccountForm.value as AccountData), username: this.newAccountForm.value.email, avsValidated: this._avsValidated };
        this.submitNewAccount.emit(accountData);
    }

    private _getAddress({ addressLine1, city, state, postalCode }: AccountData) {
        return {
            addressLine1,
            city,
            state,
            zip: postalCode,
        };
    }

    private _editAddress(correctedAddress: AddressValidationStateAddress, avsValidated: boolean): void {
        this.newAccountForm.get('addressLine1').patchValue(correctedAddress.addressLine1, { emitEvent: true });
        this.newAccountForm.get('city').patchValue(correctedAddress.city, { emitEvent: true });
        this.newAccountForm.get('state').patchValue(correctedAddress.state, { emitEvent: true });
        this.newAccountForm.get('postalCode').patchValue(correctedAddress.zip, { emitEvent: true });
        this._avsValidated = avsValidated;
    }

    private _addAgreementControl(): void {
        this.agreement = new FormControl(null, { validators: [Validators.required] });
        this.newAccountForm.addControl('agreement', this.agreement);
        this.agreement.valueChanges.pipe(takeUntil(this._destroy$)).subscribe((checked) => {
            this.agreementAccepted = !!checked;
            if (checked === false) {
                this.newAccountForm.get('agreement').reset();
            }
        });
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }
}
