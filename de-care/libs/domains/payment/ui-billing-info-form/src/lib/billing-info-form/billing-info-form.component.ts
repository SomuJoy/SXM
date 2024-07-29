import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SxmLanguages } from '@de-care/app-common';
import { CoreLoggerService, DataLayerService, FrontEndErrorEnum, FrontEndErrorModel, SharedEventTrackService } from '@de-care/data-layer';
import {
    AddressCorrectionAction,
    AddressValidationService,
    AddressValidationStateAddress,
    ComponentNameEnum,
    CustomerValidation,
    DataLayerActionEnum,
    DataValidationService,
    ErrorTypeEnum,
    SavedCC,
} from '@de-care/data-services';
import { SettingsService } from '@de-care/settings';
import { controlIsInvalid, getSxmValidator, getValidateEmailByServerFn, buildCvvLengthValidator } from '@de-care/shared/validation';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import * as uuid from 'uuid/v4';
import { SharedFlepzFormFieldsComponentApi } from '@de-care/shared/sxm-ui/ui-flepz-form-fields';
import { AddressVerificationStateService, AvsWorkflows, AvsWorkflowState, PaymentInfoOutput } from '@de-care/customer-info';
import { SxmUiAddressComponentApi } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { PrepaidRedeemComponent } from '@de-care/domains/payment/ui-prepaid-redeem';

@Component({
    selector: 'billing-info-form',
    templateUrl: './billing-info-form.component.html',
    styleUrls: ['./billing-info-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AddressVerificationStateService],
})
export class BillingInfoFormComponent implements OnInit, OnDestroy, AfterViewChecked, OnChanges, AfterViewInit {
    @Input() userClickedSubscribe: boolean;
    @Input() isClosedRadio: boolean;
    billingInfoBillingAddressModalAriaDescribedbyTextId = uuid();
    billingInfoServiceAddressModalAriaDescribedbyTextId = uuid();
    //================================================
    //===            Lifecycle events              ===
    //================================================
    constructor(
        private formBuilder: FormBuilder,
        private _eventTrackingService: SharedEventTrackService,
        private _dataValidationSrv: DataValidationService,
        private _dataLayerSrv: DataLayerService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _addressValidationService: AddressValidationService,
        private _addressVerificationStateService: AddressVerificationStateService,
        private _translate: TranslateService,
        private readonly _logger: CoreLoggerService,
        public settingsService: SettingsService
    ) {
        this._logger.debug(`${this._logPrefix} Component running `);
        const date = new Date();
        this.todaysDate = {
            month: date.getMonth() + 1,
            year: date.getFullYear(),
        };
        this.years = Array.from(new Array(11), (x, i) => i + this.todaysDate.year);
        this.months = Array.from(new Array(12), (x, i) => i + 1);
        // Set up the form
        this.paymentForm = this.formBuilder.group(
            {
                ccName: new FormControl('', {
                    updateOn: 'blur',
                }),
                ccNum: new FormControl('', {
                    validators: getSxmValidator('creditCardNumber'),
                    updateOn: 'blur',
                }),
                ccExpDate: new FormControl('', {
                    validators: getSxmValidator('creditCardExpDate'),
                    updateOn: 'blur',
                }),
            },
            { validator: this.ccExpValidator }
        );
    }

    //================================================
    //===              Helper Methods              ===
    //================================================
    get f() {
        // Getter for easy access to form fields
        return this.paymentForm.controls;
    }

    //================================================
    //===                Decorators                ===
    //================================================
    @Input() accountData: { account; isNewAccount: boolean; hasEmailAddressOnFile: boolean };
    @Input() ccError: boolean;
    @Input() serviceError: boolean;
    @Input() loading: boolean;
    @Input() isStreaming = false;
    @Input() isPlatformChanged = false;
    @Input() isOfferIncludesDevice = false;
    showPaymentOptions = true;
    @Input() set hidePaymentOptions(value) {
        // Override that when true, hides the option to select the card on file even if there is an active card on the account
        // The user must enter new payment info into the form
        this._hidePaymentOptions = value;
        if (value) {
            this.showPaymentOptions = false;
            this._selectUseCardOnFile(false);
        } else {
            //if the override has been set to false, reset form to run normal logic
            this._resetForms();
        }
    }
    @Input() customerName = null;
    @Input() isRTC = false;
    @Input() isPrepaidAllowed = true;
    @Input() hasChargeAgreement = false;
    @Input() formButtonTextCopy = '';
    todaysDate: any;
    @Output() paymentFormCompleted = new EventEmitter<PaymentInfoOutput>();
    @Output() clearForms = new EventEmitter();
    @Output() useCardOnFileSelected = new EventEmitter<boolean>();
    @Output() submitPaymentForm = new EventEmitter();
    @Output() ccIsValid = new EventEmitter();
    @ViewChild('flep') private _flepzComponent: SharedFlepzFormFieldsComponentApi;
    @ViewChild('ccNumRef') private ccNumRef: ElementRef;
    @ViewChild('billingAddress') private _billingAddressComponent: SxmUiAddressComponentApi;
    @ViewChild('serviceAddress') private _serviceAddressComponent: SxmUiAddressComponentApi;
    @ViewChild('prepaidRedeemRef') private _prepaidRedeemComponent: PrepaidRedeemComponent;
    @ViewChild('paymentFormContinueRef') private paymentFormContinueRef: ElementRef;

    //================================================
    //===                Variables                 ===
    //================================================

    private _logPrefix: string = '[Billing Info]:';
    private destroy$: Subject<boolean> = new Subject<boolean>();

    readonly translationPrefix = 'DomainsPaymentUiBillingInfoFormModule.BillingInfoFormComponent';

    months: any;
    years: any;
    selectedCC: boolean = null;
    showForm: boolean = false;
    canProgress: boolean = false;
    paymentFormSubmitted = false;
    paymentForm: FormGroup;
    submitted: boolean = false;
    customerValidateError: boolean;
    selectionErrorMessage: boolean = false;
    maskedVisible: boolean = false;
    maskedNum: string;
    creditCardInfo: SavedCC;
    trackCCSelect: string = 'cc-selected';
    trackFormContinue: string = 'payment-continue';
    trackComponentName: string = 'payment-info';
    reservedWords: string[];
    emailElementId = uuid();
    chargeAgreementAccepted = false;
    //AVS
    showInvalidBillingAddressError = false;
    showInvalidServiceAddressError = false;
    avsWorkflowState$: Observable<AvsWorkflowState>;

    ccMaskedCleared = false;
    cardOnFileInvalid = false;
    showInvalidEmail = false;
    showServiceAddressForm = false;
    isGiftCardEntered = false;
    _hidePaymentOptions = false;

    currentLang: SxmLanguages;

    emailValidationSubscription$: Subscription;

    controlIsInvalid = controlIsInvalid(() => {
        return this.submitted;
    });

    emailControlInvalid = controlIsInvalid((control) => {
        return this.showInvalidEmail;
    });

    checkGiftCardHandler($event) {
        this.isGiftCardEntered = $event.isGiftCard;
    }

    ngOnInit(): void {
        this.avsWorkflowState$ = this._addressVerificationStateService.avsWorkflowState$;
        this._addressVerificationStateService.avsWorkflowState$
            .pipe(
                takeUntil(this.destroy$),
                tap((avsWorkflowState) => {
                    this.showInvalidBillingAddressError = false;
                    this.showInvalidServiceAddressError = false;
                    switch (avsWorkflowState.currentWorkflow) {
                        case 'EDIT_BILLING_ADDRESS': {
                            this.showInvalidBillingAddressError = avsWorkflowState.hasError;
                            if (this._billingAddressComponent) {
                                this._billingAddressComponent.setFocus();
                            }
                            break;
                        }
                        case 'EDIT_SERVICE_ADDRESS': {
                            this.showInvalidServiceAddressError = avsWorkflowState.hasError;
                            if (this._serviceAddressComponent) {
                                this._serviceAddressComponent.setFocus();
                            }
                            break;
                        }
                        case 'COMPLETED': {
                            if (this.paymentForm.valid) {
                                this._completeStep();
                            } else {
                                this.loading = false;
                            }
                            break;
                        }
                    }
                })
            )
            .subscribe();
        this.currentLang = this._translate.currentLang as SxmLanguages;
        this.setFormLangValidators();

        this._translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((ev) => {
            this.currentLang = ev.lang as SxmLanguages;
            this.setFormLangValidators(true);
        });
    }

    ngAfterViewInit(): void {
        // If user arrives here after clicking Subscribe Link, notify Analytics
        if (this.userClickedSubscribe) {
            this._eventTrackingService.track(DataLayerActionEnum.EnterPaymentFromSubscribeClick, { componentName: ComponentNameEnum.PaymentInfo });
        }
    }

    ngOnChanges(simpleChanges: SimpleChanges): void {
        if (simpleChanges.accountData) {
            // new account coming in so we need to reset the form
            this._resetForms();
            const enteredEmail =
                this.accountData.account && this.accountData.account.customerInfo && this.accountData.account.customerInfo.email
                    ? this.accountData.account.customerInfo.email
                    : '';
            if (this.emailValidationSubscription$) {
                this.emailValidationSubscription$.unsubscribe();
            }

            if (!this.accountData.isNewAccount && !this.accountData.hasEmailAddressOnFile) {
                // add the email field if it doesn't already exist
                if (!this.paymentForm.controls['email']) {
                    this.paymentForm.addControl(
                        'email',
                        new FormControl('', {
                            validators: getSxmValidator('email', 'us'),
                            asyncValidators: [getValidateEmailByServerFn(this._dataValidationSrv, 0, this._changeDetectorRef)],
                            updateOn: 'blur',
                        })
                    );
                    this.emailValidationSubscription$ = this.paymentForm.controls['email'].statusChanges.subscribe(() => {
                        if (this.paymentForm.controls['email'].valid && this.paymentFormSubmitted) {
                            this.paymentFormContinue();
                        }
                    });
                }

                if (enteredEmail) {
                    this.paymentForm.controls['email'].patchValue(enteredEmail, { emitEvent: false });
                }
            } else {
                // remove the email field if it exists
                if (this.paymentForm.controls['email']) {
                    this.paymentForm.removeControl('email');
                }
            }

            if (this.accountData.isNewAccount) {
                if (!this.paymentForm.controls['flep']) {
                    this.paymentForm.addControl('flep', new FormControl(null));
                }
                // TODO: Add way to get enteredEmail passed down to flep form to auto-fill email field
                if (!this.paymentForm.controls['serviceAddress']) {
                    this.paymentForm.addControl('serviceAddress', new FormControl(''));
                }
            } else {
                if (this.paymentForm.controls['flep']) {
                    this.paymentForm.removeControl('flep');
                }
                if (this.paymentForm.controls['serviceAddress']) {
                    this.paymentForm.removeControl('serviceAddress');
                }
            }

            if (!this.paymentForm.controls['billingAddress']) {
                this.paymentForm.addControl('billingAddress', new FormControl(''));
            }

            if (this.settingsService.isCVVEnabled && !this.paymentForm.controls['ccCVV']) {
                this.paymentForm.addControl(
                    'ccCVV',
                    new FormControl('', {
                        validators: [...getSxmValidator('creditCardSecurityCode'), buildCvvLengthValidator(this.paymentForm.controls['ccNum'])],
                        updateOn: 'blur',
                    })
                );
            } else if (!this.settingsService.isCVVEnabled && this.paymentForm.controls['ccCVV']) {
                this.paymentForm.removeControl('ccCVV');
            }
        }
        if (simpleChanges.ccError && this.ccError) {
            this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.EventCCNotAuthorized));
        }
    }

    ngAfterViewChecked(): void {
        if (this.ccMaskedCleared && this.ccNumRef) {
            if (this.ccNumRef.nativeElement) {
                this.ccNumRef.nativeElement.focus();
            }
            this.ccMaskedCleared = false;
        }
    }

    ngOnDestroy() {
        this._logger.debug(`${this._logPrefix} Component destroyed `);
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        if (this.emailValidationSubscription$) {
            this.emailValidationSubscription$.unsubscribe();
        }
    }

    private setFormLangValidators(updateValuesAndValidities: boolean = false) {
        const ccNameField = this.paymentForm.get('ccName');
        ccNameField.setValidators(getSxmValidator('creditCardName', this.settingsService.settings.country, this.currentLang));
        if (updateValuesAndValidities) {
            ccNameField.updateValueAndValidity();
        }
    }

    private _resetForms() {
        this.clearForms.emit();
        // NOTE: the template checks for true/false value on this to determine radio select field ticked
        //       so setting this.selectedCC to null ensures that no radio select field is ticked
        this.selectedCC = null;
        this.showForm = this._hidePaymentOptions ? true : false;
        this.selectionErrorMessage = false;
        this.cardOnFileInvalid = false;

        this.maskedNum = null;
        this.maskedVisible = false;

        this.paymentForm.reset();
        this.paymentFormSubmitted = false;
        if (this._billingAddressComponent) {
            this._billingAddressComponent.clearForm();
        }
        if (this._serviceAddressComponent) {
            this._serviceAddressComponent.clearForm();
        }
        if (this._flepzComponent) {
            this._flepzComponent.clearForm();
        }
        if (this._prepaidRedeemComponent) {
            this._prepaidRedeemComponent.clearForm();
        }

        // Show or hide form

        if (this._hidePaymentOptions) {
            this.cardOnFileInvalid =
                this.accountData?.account?.billingSummary?.creditCard?.status === 'EXPIRED' ||
                this.accountData?.account?.billingSummary?.creditCard?.status === 'ABOUT_TO_EXPIRE';
        } else {
            // Only run this logic if the hidePaymentOptions override is false
            if (!(this.isOfferIncludesDevice && this.accountData.account.isAccountIdentifiedUsingFLEPZOrVIN)) {
                this.creditCardInfo = this.accountData.account.billingSummary.creditCard;
            }
            if (!this.creditCardInfo || this.creditCardInfo.status !== 'ACTIVE') {
                this.showPaymentOptions = false;
                this._selectUseCardOnFile(false);
                if (this.creditCardInfo) {
                    this.cardOnFileInvalid = this.creditCardInfo.status === 'EXPIRED' || this.creditCardInfo.status === 'ABOUT_TO_EXPIRE';
                }
            } else {
                this.showPaymentOptions = true;
            }
        }

        if (this.cardOnFileInvalid) {
            this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.EventExpiredCCOnFile));
        }
    }

    private _paymentCompleted(): void {
        this.paymentFormCompleted.emit({
            paymentForm: this.paymentForm.value,
            useCardOnFile: this.selectedCC,
        });
    }

    ccExpValidator = (control: AbstractControl) => {
        // Custom CC exp check validator
        if (control.value.ccExpDate) {
            const matches: string[] = control.value.ccExpDate.match(/([\d]{1,2})\/*([\d]{1,2})?/);
            if (
                parseInt(`20${matches[2]}`, 10) < this.todaysDate.year ||
                (parseInt(`20${matches[2]}`, 10) === this.todaysDate.year && parseInt(matches[1], 10) < this.todaysDate.month) ||
                control.value.ccExpDate.length < 5
            ) {
                return { invalidDate: true };
            }
        }
        return null;
    };

    ccClick(value: boolean): void {
        this._selectUseCardOnFile(value);
        this._eventTrackingService.track(this.trackCCSelect, { componentName: this.trackComponentName, usingSavedCC: value });
    }

    private _selectUseCardOnFile(useCardOnFile: boolean): void {
        this.useCardOnFileSelected.emit(useCardOnFile);
        // this._store.dispatch(CreditCardSelect({ payload: useCardOnFile }));
        this.showForm = !useCardOnFile;
        this.canProgress = true;
        this.selectedCC = useCardOnFile;
        this.selectionErrorMessage = false;
    }

    private _continueValidPaymentForm() {
        this.loading = true;
        if (this.accountData.isNewAccount && !this.showServiceAddressForm) {
            this.paymentForm.controls.serviceAddress.patchValue({ ...this.f.billingAddress.value }, { emitEvent: false });
        }

        if (this.hasChargeAgreement) {
            this.submitted = true;
        }

        let hasInvalidInput: boolean = false;
        // TODO: what is the intent of this email variable? It doesn't seem to be getting set anywhere.
        const email: string = null;

        const flep = this.accountData.isNewAccount ? (email ? { ...this.f.flep.value, email } : this.f.flep.value) : null;

        this.submitPaymentForm.emit({
            name: this.f.ccName.value || null,
            cardNumber: this.f.ccNum.value || null,
            expireMonth: (this.f.ccExpDate.value && this.f.ccExpDate.value.split('/')[0]) || null,
            expireYear: (this.f.ccExpDate.value && this.f.ccExpDate.value.split('/')[1]) || null,
            CVV: this.f.ccCVV ? this.f.ccCVV.value : null,
            email: this.f.email && this.f.email.value ? this.f.email.value : email,
            billingAddress: { ...this.f.billingAddress.value, avsvalidated: false, filled: true },
            serviceAddress: this.f.serviceAddress ? { ...this.f.serviceAddress.value, avsvalidated: false, filled: true } : null,
            flep,
        });

        const emailField = this.f.email;

        if (emailField && (emailField.status === 'PENDING' || emailField.status === 'INVALID')) {
            this.showInvalidEmail = true;
            this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.GenMissingEmail));
            this.loading = false;
            return;
        }

        if (this.creditCardInfo) {
            if (this.selectedCC === null) {
                this.selectionErrorMessage = true;
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.CheckoutMissingPaymentOption));
                this.loading = false;
                return;
            }

            if (
                (!this.f.email || !this.f.email.errors) &&
                this.selectedCC &&
                this.creditCardInfo.status === 'ACTIVE' &&
                (!this.hasChargeAgreement || (this.hasChargeAgreement && this.chargeAgreementAccepted))
            ) {
                this._paymentCompleted();
                this.clearForms.emit();
                this.maskedNum = null;
                this.maskedVisible = false;
                this.submitted = false;

                if (this.f.email) {
                    const emailValue = this.f.email ? this.f.email.value : '';
                    this.paymentForm.reset();
                    this.f.email.patchValue(emailValue, { emitEvent: false });
                } else {
                    this.paymentForm.reset();
                }

                this.loading = false;
                return;
            }
        }

        this.submitted = true;

        if (!this.paymentForm.valid || this.isGiftCardEntered || (this.hasChargeAgreement && !this.chargeAgreementAccepted)) {
            hasInvalidInput = true;
            if (this.controlIsInvalid(this.f['ccName'])) {
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.CheckoutInvalidCCName));
            }
            if (this.controlIsInvalid(this.f['ccNum']) || this.isGiftCardEntered) {
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.CheckoutInvalidCCNumber));
            }
            if (this.controlIsInvalid(this.f['ccExpDate'])) {
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.EventInvalidCCExpDate));
            }
            if (this.f.ccCVV) {
                if (this.controlIsInvalid(this.f['ccCVV'])) {
                    this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.CheckoutInvalidCCcvv));
                }
            }
            if (this.controlIsInvalid(this.f['billingAddress'])) {
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.CheckoutMissingAddress));
            }
            if (this.f['email'] && this.controlIsInvalid(this.f['email'])) {
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.CheckoutInvalidEmail));
            }
            if (this.showServiceAddressForm) {
                if (this.controlIsInvalid(this.f['serviceAddress'])) {
                    this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.CheckoutMissingAddress));
                }
            }

            if (this.paymentForm.hasError('invalidDate') && !this.controlIsInvalid(this.f['ccExpDate'])) {
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.EventInvalidCCExpDate));
            }

            //Must not be false for validator to do the validation //this.submitted = false;
            this.loading = false;
        }

        if (hasInvalidInput) {
            return;
        }

        this.serviceError = false;
        this.ccError = false;
        this.showInvalidBillingAddressError = false;
        this.ccIsValid.emit();

        const validateAddressesPayload: CustomerValidation = {
            billingAddress: this.f.billingAddress.value,
            creditCard: {
                creditCardNumber: this.f.ccNum.value,
            },
        };
        if (this.accountData.isNewAccount) {
            validateAddressesPayload.serviceAddress = this.f.serviceAddress.value;
        }

        this._addressValidationService.validateAddresses(validateAddressesPayload).subscribe({
            next: (avsValidationState) => {
                const avsState = {
                    billingAddress: avsValidationState.billingAddress
                        ? {
                              currentAddress: this.f.billingAddress.value,
                              correctedAddresses: avsValidationState.billingAddress.correctedAddresses,
                              validated: avsValidationState.billingAddress.validated,
                              addressCorrectionAction: avsValidationState.billingAddress.addressCorrectionAction,
                          }
                        : null,
                    serviceAddress: avsValidationState.serviceAddress
                        ? {
                              currentAddress: this.f.serviceAddress.value,
                              correctedAddresses: avsValidationState.serviceAddress.correctedAddresses,
                              validated: avsValidationState.serviceAddress.validated,
                              addressCorrectionAction: avsValidationState.serviceAddress.addressCorrectionAction,
                          }
                        : null,
                };
                if (avsValidationState.billingAddress && avsValidationState.billingAddress.addressCorrectionAction === AddressCorrectionAction.AutoCorrect) {
                    this._editBillingAddress(avsValidationState.billingAddress.correctedAddresses[0], avsValidationState.billingAddress.validated);
                    avsState.billingAddress = null;
                }
                if (avsValidationState.serviceAddress && avsValidationState.serviceAddress.addressCorrectionAction === AddressCorrectionAction.AutoCorrect) {
                    this._editServiceAddress(avsValidationState.serviceAddress.correctedAddresses[0], avsValidationState.serviceAddress.validated);
                    avsState.serviceAddress = null;
                }
                this._addressVerificationStateService.setAvsInitialState(avsState);
                this.loading = false;
            },
            error: () => {
                this.customerValidateError = true;
                this.loading = false;
            },
        });

        this.submitted = false;

        this._eventTrackingService.track(this.trackFormContinue, { componentName: this.trackComponentName });
    }

    paymentFormContinue() {
        // NOTE Here we need to either return no address and credit card saved or new address to parent, then parent continues
        this.paymentFormSubmitted = true;

        this._continueValidPaymentForm();
    }

    private _editBillingAddress(correctedAddress: AddressValidationStateAddress, avsvalidated: boolean): void {
        this.paymentForm.controls.billingAddress.patchValue({ ...correctedAddress }, { emitEvent: true });
        this.submitPaymentForm.emit({
            billingAddress: {
                ...correctedAddress,
                avsvalidated,
                filled: true,
            },
        });
    }

    private _editServiceAddress(correctedAddress: AddressValidationStateAddress, avsvalidated: boolean): void {
        this.paymentForm.controls.serviceAddress.patchValue({ ...correctedAddress }, { emitEvent: true });
        this.submitPaymentForm.emit({
            serviceAddress: {
                ...correctedAddress,
                avsvalidated,
                filled: true,
            },
        });
    }

    private _completeStep() {
        // TODO: determine if we still need this timer
        timer(1).subscribe(() => {
            this._paymentCompleted();
        });

        const currentCCNum = this.paymentForm.value.ccNum.substr(-4);

        this.maskedNum = '************' + currentCCNum;
        this.maskedVisible = true;
        if (this.paymentForm.controls['ccCVV']) {
            this.paymentForm.controls.ccCVV.reset();
        }
    }

    clearInput = () => {
        this.paymentForm.controls.ccNum.reset();
        this.maskedNum = '';
        this.maskedVisible = false;
        this.ccMaskedCleared = true;
    };

    onAcceptCorrectedAddress(address, validated: boolean, avsWorkflow: AvsWorkflows) {
        switch (avsWorkflow) {
            case 'BILLING_ADDRESS_MODAL': {
                const serviceSameAsBilling = this.accountData.isNewAccount && !this.showServiceAddressForm;
                this._editBillingAddress(address, validated);
                this.showInvalidBillingAddressError = false;
                if (serviceSameAsBilling) {
                    this._editServiceAddress(address, validated);
                    this.showInvalidServiceAddressError = false;
                }
                this._addressVerificationStateService.correctedBillingAddressAccepted(serviceSameAsBilling);
                break;
            }
            case 'SERVICE_ADDRESS_MODAL': {
                this._editServiceAddress(address, validated);
                this.showInvalidServiceAddressError = false;
                this._addressVerificationStateService.correctedServiceAddressAccepted();
                break;
            }
        }
    }

    onEditExistingAddress(avsWorkflow: AvsWorkflows) {
        this._addressVerificationStateService.setAvsToEditAddressMode(avsWorkflow);
    }

    onServiceAddressIsSameClick(checked: boolean) {
        this.showServiceAddressForm = !checked;
        if (!checked && JSON.stringify(this.paymentForm.controls.serviceAddress.value) === JSON.stringify(this.paymentForm.controls.billingAddress.value)) {
            this.paymentForm.controls.serviceAddress.reset({
                addressLine1: '',
                city: '',
                state: '',
                zip: '',
            });
        }
        // TODO: figure out if we need to update SxmUiAddressComponent to be able to support it resetting error messages on all its fields
        //       It appears to not reset those when updateValueAndValidity is called...
        //       (may be due to the fact that this is a FormControl at parent level and not a FormGroup)
        this.paymentForm.controls.serviceAddress.updateValueAndValidity();
    }
}
