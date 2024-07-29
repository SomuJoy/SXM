import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SxmLanguages } from '@de-care/app-common';
import { getSxmValidator, getValidateEmailByServerFn } from '@de-care/shared/validation';
import * as uuid from 'uuid/v4';
import { sxmCountries } from '@de-care/settings';
import {
    AddressCorrectionAction,
    AddressValidationService,
    AddressValidationStateAddress,
    ComponentNameEnum,
    CustomerValidation,
    DataLayerDataTypeEnum,
    DataValidationService,
    ErrorTypeEnum,
    FlowNameEnum,
    ProspectModel,
} from '@de-care/data-services';
import { DataLayerService, FrontEndErrorEnum, FrontEndErrorModel } from '@de-care/data-layer';
import { AvsWorkflows, AvsWorkflowState, AddressVerificationStateService } from '@de-care/customer-info';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { setFocusOnInputField } from '@de-care/browser-common';
import { SxmUiNucaptchaComponent } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { getIncludeActivationInstructions, LegacyValidateNucaptchaAnswerWorkflowService } from '@de-care/de-care-use-cases/trial-activation/state-legacy';
import { Store } from '@ngrx/store';

export interface OneStepAccountData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    username: string;
    avsValidated: boolean;
}

@Component({
    selector: 'one-step-new-account-form-step',
    templateUrl: './one-step-new-account-form-step.component.html',
    styleUrls: ['./one-step-new-account-form-step.component.scss'],
    providers: [AddressVerificationStateService],
})
export class OneStepNewAccountFormStepComponent implements OnInit, OnChanges, OnDestroy {
    @Input() set prospectData(prospectData: ProspectModel) {
        this._prospectData = prospectData;
        if (prospectData) {
            this.prefillData = prospectData;
        } else {
            this.prefillData = null;
        }
    }

    @Input() country: sxmCountries = 'us';
    @Input() lang: SxmLanguages = 'en-US';
    @Input() canEditUsername = true;
    @Input() isLoadingExternally = false;
    @Input() hasExternalError = false;
    @Input() displayNucaptcha = false;
    @Output() submitNewAccount = new EventEmitter<OneStepAccountData>();
    @ViewChild('nuCaptcha', { static: false }) private _nucaptchaComponent: SxmUiNucaptchaComponent;

    submitted = false;
    newAccountForm: FormGroup;
    isCanada: boolean;
    isQuebec: boolean = false;
    isLoading: boolean = false;
    emailControlName = 'email';
    email: string;
    captchaAnswerWrong = false;
    agreementAccepted = false;
    agreement: FormControl;
    private _destroy$ = new Subject<boolean>();

    readonly emailId = uuid();
    readonly phoneNumberId = uuid();
    readonly addressLine1Id = uuid();
    readonly cityId = uuid();
    readonly stateId = uuid();
    readonly postalCodeId = uuid();
    readonly contestMessageId = uuid();
    oneStepNewAccModalAriaDescribedbyTextId = uuid();

    includeActivationInstructions$ = this._store.select(getIncludeActivationInstructions);
    prefillData: ProspectModel;
    showInvalidAddressError = false;
    unexpectedError = false;
    avsWorkflowState$: Observable<AvsWorkflowState>;
    private _avsValidated = false;
    private _prospectData: ProspectModel;
    @ViewChild('addressLine1Element', { static: true }) private _addressLine1Element: ElementRef;

    constructor(
        private _formBuilder: FormBuilder,
        private _dataLayerSrv: DataLayerService,
        private readonly _dataValidationService: DataValidationService,
        private _addressValidationService: AddressValidationService,
        private _addressVerificationStateService: AddressVerificationStateService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _legacyValidateNucaptchaAnswerWorkflowService: LegacyValidateNucaptchaAnswerWorkflowService,
        private readonly _store: Store
    ) {}

    ngOnInit() {
        this.isCanada = this.country === 'ca';
        this._genNewAccountForm();
        this._setDynamicValidators();
        this._handleNucaptchaControl();
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
        if (this.newAccountForm) {
            this._setDynamicValidators();
        }
    }

    sendForm(): void {
        this.submitted = true;
        this.isLoading = true;
        this.showInvalidAddressError = false;
        this.captchaAnswerWrong = false;
        if (this.newAccountForm.valid) {
            if (this.displayNucaptcha) {
                const token = this._nucaptchaComponent.getCaptchaToken();
                this._legacyValidateNucaptchaAnswerWorkflowService
                    .build({
                        answer: this.newAccountForm.value.captchaAnswer.answer,
                        token,
                    })
                    .subscribe((valid) => {
                        this.isLoading = false;
                        if (valid) {
                            this._validateAddress(this._getAddress(this.newAccountForm.value));
                        } else {
                            this.captchaAnswerWrong = true;
                        }
                    });
            } else {
                this._validateAddress(this._getAddress(this.newAccountForm.value));
            }
        } else {
            this._logErrorsToDataLayer();
            this.isLoading = false;
        }
    }

    private _handleNucaptchaControl() {
        if (this.displayNucaptcha) {
            !this.newAccountForm.get('captchaAnswer') &&
                this.newAccountForm.addControl(
                    'captchaAnswer',
                    this._formBuilder.control(null, {
                        validators: [...getSxmValidator('nucaptcha')],
                    })
                );
        } else {
            this.newAccountForm.get('captchaAnswer') && this.newAccountForm.removeControl('captchaAnswer');
        }
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

    private _logErrorsToDataLayer() {
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
    }

    private _genNewAccountForm(): void {
        this.newAccountForm = this._formBuilder.group({
            email: [
                null,
                {
                    validators: getSxmValidator('email'),
                    updateOn: 'blur',
                },
            ],
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
            const email = this.newAccountForm.get('email');
            const addressLine1 = this.newAccountForm.get('addressLine1');
            const city = this.newAccountForm.get('city');
            const postalCode = this.newAccountForm.get('postalCode');
            const state = this.newAccountForm.get('state');

            email.setValidators(getSxmValidator('email', this.country, this.lang));
            email.setAsyncValidators(getValidateEmailByServerFn(this._dataValidationService, 250, this._changeDetectorRef));
            addressLine1.setValidators(getSxmValidator('address', this.country, this.lang));
            city.setValidators(getSxmValidator('city', this.country, this.lang));
            postalCode.setValidators(getSxmValidator('zipCode', this.country, this.lang));
            state.setValidators(getSxmValidator('province', this.country, this.lang));

            if (updateValueAndValidities) {
                email.updateValueAndValidity();
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

    gotCaptcha() {
        this.newAccountForm.get('captchaAnswer').reset(null);
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
        const accountData = {
            ...(this.newAccountForm.value as OneStepAccountData),
            firstName: this._prospectData.firstName || null,
            lastName: this._prospectData.lastName || null,
            username: this.newAccountForm.value.email,
            avsValidated: this._avsValidated,
        };
        this.submitNewAccount.emit(accountData);
    }

    private _getAddress({ addressLine1, city, state, postalCode }: OneStepAccountData) {
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

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }
}
