import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
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
import { PaymentInfoOutput } from '../models/payment-info.model';
import { AddressVerificationStateService, AvsWorkflows, AvsWorkflowState } from '../address-verification-state.service';
import { CoreLoggerService, DataLayerService, FrontEndErrorEnum, FrontEndErrorModel, SharedEventTrackService } from '@de-care/data-layer';
import { AddressValidationStateAddress, ComponentNameEnum, DataLayerActionEnum, ErrorTypeEnum, SavedCC } from '@de-care/data-services';
import { SettingsService } from '@de-care/settings';
import { SharedFlepzFormFieldsComponentApi } from '@de-care/shared/sxm-ui/ui-flepz-form-fields';
import { wireUpCreditCardNameAutofill } from '@de-care/shared/forms/forms-common';
import { controlIsInvalid, buildCvvLengthValidator, getSxmValidator } from '@de-care/shared/validation';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { PrepaidRedeemComponent } from '@de-care/domains/payment/ui-prepaid-redeem';
import { SxmUiAddressComponentApi } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { SxmUiPostalCodeFormWrapperApi } from '@de-care/shared/sxm-ui/ui-postal-code-form-wrapper';
import * as uuid from 'uuid/v4';

import { AddressCorrectionAction, CustomerValidationAddressesWorkFlowService, CustomerValidation } from '@de-care/domains/customer/state-customer-verification';

@Component({
    selector: 'payment-info-streaming-organic',
    templateUrl: './payment-info-streaming-organic.component.html',
    styleUrls: ['./payment-info-streaming-organic.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AddressVerificationStateService],
})
export class PaymentInfoStreamingOrganicComponent implements OnInit, OnDestroy, AfterViewChecked, OnChanges, AfterViewInit {
    @Input() userClickedSubscribe: boolean;
    @Input() isClosedRadio: boolean;
    paymentStreamingBillingAddressModalAriaDescribedbyTextId = uuid();
    paymentStreamingServiceAddressModalAriaDescribedbyTextId = uuid();
    //================================================
    //===            Lifecycle events              ===
    //================================================
    constructor(
        private formBuilder: FormBuilder,
        private _eventTrackingService: SharedEventTrackService,
        private _dataLayerSrv: DataLayerService,
        private _addressVerificationStateService: AddressVerificationStateService,
        private readonly _customerValidationAddressesWorkFlowService: CustomerValidationAddressesWorkFlowService,
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
    @Input() isCanadaMode = false;
    @Input() reducedFields = false;
    @Input() isPlatformChanged = false;
    @Input() isOfferIncludesDevice = false;
    @Input() customerName = null;
    @Input() isRTC = false;
    @Input() includeServiceAddressOption = false;
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
    @ViewChild('postalCodeFormWrapper', { static: false }) private postalCodeFormWrapper: SxmUiPostalCodeFormWrapperApi;
    @ViewChild('paymentFormContinueRef') private paymentFormContinueRef: ElementRef;

    //================================================
    //===                Variables                 ===
    //================================================

    private _logPrefix: string = '[Payment Info]:';
    private destroy$: Subject<boolean> = new Subject<boolean>();

    translateKeyPrefix = 'customerInfo.PaymentInfoStreamingOrganicComponent';
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
    //AVS
    showInvalidBillingAddressError = false;
    showInvalidServiceAddressError = false;
    avsWorkflowState$: Observable<AvsWorkflowState>;

    ccMaskedCleared = false;
    showPaymentOptions = true;
    cardOnFileInvalid = false;
    showServiceAddressForm = false;
    isGiftCardEntered = false;
    invalidZipFromLookup$ = new BehaviorSubject(false);

    currentLang: SxmLanguages;

    controlIsInvalid = controlIsInvalid(() => {
        return this.submitted;
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
        if (this.accountData?.isNewAccount) {
            wireUpCreditCardNameAutofill(this._flepzComponent?.firstName, this._flepzComponent?.lastName, this.paymentForm?.get('ccName'))
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
    }

    ngOnChanges(simpleChanges: SimpleChanges): void {
        if (simpleChanges.accountData) {
            // new account coming in so we need to reset the form
            this._resetForms();

            if (this.accountData.isNewAccount) {
                if (!this.paymentForm.controls['flep']) {
                    this.paymentForm.addControl('flep', new FormControl(null));
                }
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

            // Show or hide form
            if (!(this.isOfferIncludesDevice && this.accountData.account.isAccountIdentifiedUsingFLEPZOrVIN)) {
                this.creditCardInfo = this.accountData.account.billingSummary.creditCard;
            }
            if (!this.creditCardInfo || this.creditCardInfo.status !== 'ACTIVE') {
                this.showPaymentOptions = false;
                this._selectUseCardOnFile(false);
                if (this.creditCardInfo) {
                    this.cardOnFileInvalid = this.creditCardInfo.status === 'EXPIRED' || this.creditCardInfo.status === 'ABOUT_TO_EXPIRE';
                    if (this.cardOnFileInvalid) {
                        this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.EventExpiredCCOnFile));
                    }
                }
            } else {
                this.showPaymentOptions = true;
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
        this.showForm = false;
        this.selectionErrorMessage = false;

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
        if (this.postalCodeFormWrapper) {
            // we need to force it to null, there is an issue here with reset
            this.postalCodeFormWrapper.reset();
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
        this.invalidZipFromLookup$.next(false);

        if (this.accountData.isNewAccount && !this.showServiceAddressForm) {
            this.paymentForm.controls.serviceAddress.patchValue({ ...this.f.billingAddress.value }, { emitEvent: false });
        }
        let hasInvalidInput: boolean = false;

        const flep = this.accountData.isNewAccount ? this.f.flep.value : null;

        this.submitPaymentForm.emit({
            name: this.f.ccName.value || null,
            cardNumber: this.f.ccNum.value || null,
            expireMonth: (this.f.ccExpDate.value && this.f.ccExpDate.value.split('/')[0]) || null,
            expireYear: (this.f.ccExpDate.value && this.f.ccExpDate.value.split('/')[1]) || null,
            CVV: this.f.ccCVV ? this.f.ccCVV.value : null,
            billingAddress: { ...this.f.billingAddress.value, avsvalidated: false, filled: true },
            serviceAddress: this.f.serviceAddress ? { ...this.f.serviceAddress.value, avsvalidated: false, filled: true } : null,
            flep,
        });

        if (this.creditCardInfo) {
            if (this.selectedCC === null) {
                this.selectionErrorMessage = true;
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.CheckoutMissingPaymentOption));
                this.loading = false;
                return;
            }

            if (this.selectedCC && this.creditCardInfo.status === 'ACTIVE') {
                this._paymentCompleted();
                this.clearForms.emit();
                this.maskedNum = null;
                this.maskedVisible = false;
                this.submitted = false;
                this.paymentForm.reset();
                this.loading = false;
                return;
            }
        }

        this.submitted = true;

        if (!this.paymentForm.valid || this.isGiftCardEntered) {
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

        this._customerValidationAddressesWorkFlowService.build(validateAddressesPayload).subscribe({
            next: (avsValidationState) => {
                if (this.reducedFields && !avsValidationState?.billingAddress?.validated) {
                    this.loading = false;
                    this.invalidZipFromLookup$.next(true);
                    return;
                }

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
