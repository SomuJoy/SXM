import { CoreLoggerService } from '@de-care/data-layer';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SxmLanguages } from '@de-care/app-common';
import { AddressCorrectionAction, AddressValidationStateAddress, CustomEventNameEnum } from '@de-care/data-services';
import { SettingsService } from '@de-care/settings';
import { controlIsInvalid } from '@de-care/shared/validation';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, timer, BehaviorSubject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { NewAccountFormFieldsComponentApi, AccountData } from '@de-care/domains/account/ui-new-account-form-fields';
import { CreditCardFormFieldsComponentApi } from '@de-care/domains/purchase/ui-credit-card-form-fields';
import { AddressVerificationStateService, AvsWorkflows, AvsWorkflowState } from '@de-care/customer-info';
import { FollowOnData } from '@de-care/domains/purchase/ui-trial-follow-on-form-field';
import { setFollowOnOptionSelected, setFollowOnOptionNotSelected, TrialValidateNucaptchaWorkflowService } from '@de-care/de-care-use-cases/roll-to-drop/state-streaming';
import { Store } from '@ngrx/store';
import { DOCUMENT } from '@angular/common';
import * as uuid from 'uuid/v4';
import { behaviorEventReactionForTransactionId } from '@de-care/shared/state-behavior-events';
import { SxmUiAddressComponentApi } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { wireUpCreditCardNameAutofill } from '@de-care/shared/forms/forms-common';
import { RTDAddress, RTDPaymentInfo, setLoadYourInfoDataAsNotProcessing, setLoadYourInfoDataAsProcessing } from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { SxmUiNucaptchaComponent } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { CustomerValidation, CustomerValidationAddressesWorkFlowService } from '@de-care/domains/customer/state-customer-verification';

export interface EnterYourInformationComponentApi {
    clearForm: () => void;
}

@Component({
    selector: 'de-care-enter-your-information',
    templateUrl: './enter-your-information.component.html',
    styleUrls: ['./enter-your-information.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AddressVerificationStateService],
})
export class EnterYourInformationComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit, EnterYourInformationComponentApi {
    //================================================
    //===                Decorators                ===
    //================================================
    @Input() userClickedSubscribe: boolean;
    @Input() isClosedRadio: boolean;

    @Input() accountData: { account; isNewAccount: boolean; hasEmailAddressOnFile: boolean };
    @Input() isStreamingFlow = false;
    @Input() reducedFields = false;
    @Input() followOnData: FollowOnData;
    @Input() prefilledSessionCustomerData: { firstName: string; lastName: string; postalCode: string };

    @Input() ccError: boolean;
    @Input() passwordError: boolean;
    @Input() serviceError: boolean;
    @Input() loading: boolean;
    @Input() isPlatformChanged = false;
    @Input() customerName = null;
    @Input() displayNucaptcha: boolean;

    @Output() submitYourInfoForm = new EventEmitter();
    @Output() paymentFormCompleted = new EventEmitter();
    @Output() noPaymentFormCompleted = new EventEmitter();
    @Output() setCCError = new EventEmitter<boolean>();

    @ViewChild('accountInfo') private readonly _newAccountFormFieldsComponent: NewAccountFormFieldsComponentApi;
    @ViewChild('paymentInfo') private readonly _paymentInfoComponent: CreditCardFormFieldsComponentApi;
    @ViewChild('billingAddress') private readonly _billingAddressComponent: SxmUiAddressComponentApi;
    @ViewChild('nuCaptcha', { static: false }) private _nucaptchaComponent: SxmUiNucaptchaComponent;

    //================================================
    //===                Variables                 ===
    //================================================

    private _logPrefix = '[Enter Your Info]:';
    private destroy$: Subject<boolean> = new Subject<boolean>();

    translateKeyPrefix = 'deCareUseCasesRollToDropUiSharedModule.enterYourInformationComponent';

    prospectData: AccountData;
    yourInfoForm: FormGroup;
    infoFormSubmitted = false;
    submitted = false;
    enterYourInfoBillingAddressModalAriaDescribedbyTextId = uuid();
    enterYourInfoServiceAddressModalAriaDescribedbyTextId = uuid();

    maskedVisible = false;
    maskedNum: string;
    //AVS
    showInvalidBillingAddressError = false;
    showInvalidServiceAddressError = false;
    avsWorkflowState$: Observable<AvsWorkflowState>;

    currentLang: SxmLanguages;

    isFollowOnChecked = false;
    displayPaymentForm = false;
    showBillingAddressForm = false;
    private transactionId: string;
    private readonly _window: Window;

    captchaAnswerWrong$ = new BehaviorSubject<boolean>(false);
    captchaAnswer: { answer: string };
    invalidZipFromLookup$ = new BehaviorSubject(false);

    //================================================
    //===            Lifecycle events              ===
    //================================================
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly _customerValidationAddressesWorkFlowService: CustomerValidationAddressesWorkFlowService,
        private readonly _addressVerificationStateService: AddressVerificationStateService,
        private readonly _translate: TranslateService,
        public readonly settingsService: SettingsService,
        private readonly _store: Store,
        private readonly _logger: CoreLoggerService,
        private readonly _trialValidateNucaptchaWorkflowService: TrialValidateNucaptchaWorkflowService,
        @Inject(DOCUMENT) readonly document: Document
    ) {
        this._logger.debug(`${this._logPrefix} Component running `);
        this._window = document.defaultView;
        // Set up the form
        this.yourInfoForm = this.formBuilder.group({
            // new-account-form-fields will initiate accountInfo
            accountInfo: [],
            followOnChecked: [false],
            paymentInfo: [],
            serviceAddressSameAsBilling: [true],
            billingAddress: [''],
        });
    }

    //================================================
    //===              Helper Methods              ===
    //================================================
    get formCtrlFields() {
        return this.yourInfoForm.controls;
    }

    get actInfoCtrlFields() {
        return this.formCtrlFields.accountInfo['controls'];
    }

    controlIsInvalid = controlIsInvalid(() => {
        return this.submitted;
    });

    ngOnInit(): void {
        this.prospectData = { username: this.accountData.account.customerInfo.email, ...this.prefilledSessionCustomerData };
        this._initFormCheckboxes();

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
                            if (this._newAccountFormFieldsComponent) {
                                this._newAccountFormFieldsComponent.setFocusOnServiceAddress();
                            }
                            break;
                        }
                        case 'COMPLETED': {
                            if (
                                (!this.ccError && !this.serviceError && this.isFollowOnChecked && this.yourInfoForm.valid) ||
                                (!this.isFollowOnChecked && this.formCtrlFields.accountInfo.valid)
                            ) {
                                this._completeStep();
                            } else {
                                this._store.dispatch(setLoadYourInfoDataAsNotProcessing());
                            }
                            break;
                        }
                    }
                })
            )
            .subscribe();

        this.currentLang = this._translate.currentLang as SxmLanguages;
        this._translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((ev) => {
            this.currentLang = ev.lang as SxmLanguages;
        });
    }

    ngOnChanges(simpleChanges: SimpleChanges): void {
        if (simpleChanges.accountData) {
            this._resetForms();
        }
    }

    ngAfterViewInit() {
        if (this.accountData?.isNewAccount) {
            wireUpCreditCardNameAutofill(this._newAccountFormFieldsComponent?.firstName, this._newAccountFormFieldsComponent?.lastName, this._paymentInfoComponent?.ccName)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    onContinue() {
        // NOTE Here we need to either return no address and credit card saved or new address to parent, then parent continues
        this.infoFormSubmitted = true;
        this._continueValidPaymentForm();
    }

    handleUnmaskCC(): void {
        this.maskedVisible = false;
        this.maskedNum = null;
    }

    clearForm(): void {
        this._resetForms();
    }

    private _getRTDAddress(payload: any): RTDAddress {
        const country = this.actInfoCtrlFields?.country?.value;
        return { ...payload, country };
    }

    private _getRTDPaymentInfo(): RTDPaymentInfo {
        const billingAddress: RTDAddress = { ...this._getRTDAddress(this.formCtrlFields?.billingAddress?.value) };
        const ccInfo = this.isFollowOnChecked ? this.formCtrlFields.paymentInfo.value : null;
        return {
            billingAddress,
            ccExpDate: ccInfo ? ccInfo.ccExpDate || null : null,
            ccName: ccInfo ? ccInfo.ccName || null : null,
            ccNum: ccInfo ? ccInfo.ccNum || null : null,
            securityCode: ccInfo ? ccInfo.ccCVV || null : null,
            transactionId: this.transactionId || null,
        };
    }

    private _initFormCheckboxes(): void {
        //ToDo: Doing following since initializing form controls not reflecting.
        //      Remove this initialization once fixed.
        this.formCtrlFields.followOnChecked.setValue(false);
        this.formCtrlFields.followOnChecked.updateValueAndValidity();
        this.formCtrlFields.serviceAddressSameAsBilling.setValue(true);
        this.formCtrlFields.serviceAddressSameAsBilling.updateValueAndValidity();
    }

    private _resetForms() {
        this.maskedNum = null;
        this.maskedVisible = false;

        this.yourInfoForm.reset();
        this._initFormCheckboxes();
        this.onFollowOnCheckedClick(false);
        this.onServiceAddressSameAsBillingCheckboxClick(true);
        this.infoFormSubmitted = false;

        if (this._newAccountFormFieldsComponent) {
            this._newAccountFormFieldsComponent.clearForm();
            this.prospectData = { username: this.accountData.account.customerInfo.email, ...this.prefilledSessionCustomerData };
        }
        if (this._billingAddressComponent) {
            this._billingAddressComponent.clearForm();
        }
        if (this._paymentInfoComponent) {
            this._paymentInfoComponent.clearForm();
        }
    }

    private _paymentCompleted(): void {
        this.paymentFormCompleted.emit();
    }

    private _withoutPaymentCompleted(): void {
        this.captchaAnswerWrong$.next(false);
        const captchaToken = this._nucaptchaComponent?.getCaptchaToken();

        if (!captchaToken || this.captchaAnswer) {
            if (captchaToken) {
                this._trialValidateNucaptchaWorkflowService
                    .build({
                        token: captchaToken,
                        answer: this.captchaAnswer.answer,
                    })
                    .subscribe((valid) => {
                        if (valid) {
                            this.noPaymentFormCompleted.emit();
                        } else {
                            this.captchaAnswerWrong$.next(true);
                            this._store.dispatch(setLoadYourInfoDataAsNotProcessing());
                        }
                    });
            } else {
                this.noPaymentFormCompleted.emit();
            }
        }
    }

    //ToDo: Refactor while implementing DEX-16628
    private _continueValidPaymentForm() {
        this.invalidZipFromLookup$.next(false);
        this._store.dispatch(setLoadYourInfoDataAsProcessing());

        this._removeBillingAddressControlsWhenInTokenizedFlow();
        if (!this.showBillingAddressForm && this.actInfoCtrlFields) {
            this.yourInfoForm.controls.billingAddress.patchValue({ ...this.actInfoCtrlFields?.serviceAddress?.value }, { emitEvent: false });
        }

        let hasInvalidInput = false;
        const ccInfo = this.isFollowOnChecked ? this.formCtrlFields?.paymentInfo?.value : null;
        this._generateNewCCTransactionId();

        this.submitYourInfoForm.emit({
            ...(this.actInfoCtrlFields?.serviceAddress && { accountInfo: { ...this._getRTDAddress(this.actInfoCtrlFields?.serviceAddress?.value) } }),
            paymentInfo: this.displayPaymentForm ? this._getRTDPaymentInfo() : null,
            name: ccInfo ? ccInfo.ccName || null : null,
            cardNumber: ccInfo ? ccInfo.ccNum || null : null,
            expireMonth: ccInfo ? (ccInfo.ccExpDate && ccInfo.ccExpDate.split('/')[0]) || null : null,
            expireYear: ccInfo ? (ccInfo.ccExpDate && ccInfo.ccExpDate.split('/')[1]) || null : null,
            CVV: ccInfo ? (ccInfo.ccCVV ? ccInfo.ccCVV : null) : null,
            billingAddress: { ...this._getRTDAddress(this.formCtrlFields?.billingAddress?.value), avsvalidated: false, filled: true },
            ...(this.actInfoCtrlFields?.serviceAddress && {
                serviceAddress: { ...this._getRTDAddress(this.actInfoCtrlFields?.serviceAddress?.value), avsvalidated: false, filled: true },
            }),
        });

        this.submitted = true;

        if ((this.isFollowOnChecked && !this.yourInfoForm.valid) || (!this.isFollowOnChecked && !this.formCtrlFields?.accountInfo?.valid)) {
            hasInvalidInput = true;
            this._store.dispatch(setLoadYourInfoDataAsNotProcessing());
        }

        if (hasInvalidInput) {
            return;
        }

        this.serviceError = false;
        this.setCCError.emit(false);
        this.showInvalidBillingAddressError = false;

        const validateAddressesPayload: CustomerValidation = {
            ...(this.actInfoCtrlFields?.serviceAddress && { serviceAddress: this.actInfoCtrlFields?.serviceAddress?.value }),
        };
        if (this.displayPaymentForm) {
            validateAddressesPayload.billingAddress = this.showBillingAddressForm ? this.formCtrlFields?.billingAddress?.value : this.actInfoCtrlFields?.serviceAddress?.value;
            validateAddressesPayload.creditCard = { creditCardNumber: ccInfo.ccNum };
        }

        if (!!validateAddressesPayload) {
            this._customerValidationAddressesWorkFlowService.build(validateAddressesPayload).subscribe({
                next: (avsValidationState) => {
                    if (this.reducedFields && !avsValidationState?.serviceAddress?.validated) {
                        this._store.dispatch(setLoadYourInfoDataAsNotProcessing());
                        this.submitted = false;
                        this.invalidZipFromLookup$.next(true);
                        return;
                    }

                    const avsState: any = {
                        ...(avsValidationState?.serviceAddress && { serviceAddress: avsValidationState?.serviceAddress }),
                        ...(this.actInfoCtrlFields?.serviceAddress && { currentAddress: this.actInfoCtrlFields.serviceAddress.value }),
                        ...(avsValidationState?.serviceAddress && { correctedAddresses: avsValidationState.serviceAddress.correctedAddresses }),
                        ...(avsValidationState?.serviceAddress && { validated: avsValidationState.serviceAddress.validated }),
                        ...(avsValidationState?.serviceAddress && { addressCorrectionAction: avsValidationState.serviceAddress.addressCorrectionAction }),
                    };

                    if (avsValidationState?.serviceAddress && avsValidationState?.serviceAddress?.addressCorrectionAction === AddressCorrectionAction.AutoCorrect) {
                        this._editServiceAddress(avsValidationState?.serviceAddress?.correctedAddresses[0], avsValidationState?.serviceAddress?.validated);
                        avsState.serviceAddress = null;
                    }

                    if (this.showBillingAddressForm) {
                        avsState.billingAddress = avsValidationState?.billingAddress
                            ? {
                                  currentAddress: this.formCtrlFields?.billingAddress?.value,
                                  correctedAddresses: avsValidationState?.billingAddress?.correctedAddresses,
                                  validated: avsValidationState?.billingAddress?.validated,
                                  addressCorrectionAction: avsValidationState?.billingAddress?.addressCorrectionAction,
                              }
                            : null;

                        if (avsValidationState?.billingAddress && avsValidationState?.billingAddress?.addressCorrectionAction === AddressCorrectionAction.AutoCorrect) {
                            this._editBillingAddress(avsValidationState?.billingAddress?.correctedAddresses[0], avsValidationState?.billingAddress?.validated);
                            avsState.billingAddress = null;
                        }
                    } else {
                        avsState.serviceAddress = avsValidationState?.serviceAddress
                            ? {
                                  currentAddress: this.actInfoCtrlFields?.serviceAddress?.value,
                                  correctedAddresses: avsValidationState?.serviceAddress?.correctedAddresses,
                                  validated: avsValidationState?.serviceAddress?.validated,
                                  addressCorrectionAction: avsValidationState?.serviceAddress?.addressCorrectionAction,
                              }
                            : null;
                        if (avsValidationState?.serviceAddress && avsValidationState?.serviceAddress?.addressCorrectionAction === AddressCorrectionAction.AutoCorrect) {
                            this._editServiceAddress(avsValidationState?.serviceAddress?.correctedAddresses[0], avsValidationState?.serviceAddress?.validated);
                            avsState.serviceAddress = null;
                        }
                    }
                    this.setCCError.emit(!avsValidationState.ccValidation?.valid);

                    this._addressVerificationStateService.setAvsInitialState(avsState);
                    if (!this.ccError) {
                        this._store.dispatch(setLoadYourInfoDataAsProcessing());
                    }
                },
                error: () => {
                    this._addressVerificationStateService.setAvsInitialState({});
                    this.serviceError = true;
                    this._store.dispatch(setLoadYourInfoDataAsNotProcessing());
                },
            });
        } else {
            this._addressVerificationStateService.skipVerification();
            this._completeStep();
        }

        this.submitted = false;
    }

    private _removeBillingAddressControlsWhenInTokenizedFlow(): void {
        if (!this.showBillingAddressForm && !!!this.actInfoCtrlFields) {
            const form = this.yourInfoForm as FormGroup;
            form.removeControl('billingAddress');
            console.log(form);
        }
    }

    private _editBillingAddress(correctedAddress: AddressValidationStateAddress, avsvalidated: boolean): void {
        this.formCtrlFields?.billingAddress?.patchValue({ ...correctedAddress }, { emitEvent: true });
        this.submitYourInfoForm.emit({
            paymentInfo: this._getRTDPaymentInfo(),
            billingAddress: {
                ...this._getRTDAddress(correctedAddress),
                avsvalidated,
                filled: true,
            },
        });
    }

    private _editServiceAddress(correctedAddress: AddressValidationStateAddress, avsvalidated: boolean): void {
        const serviceAddressValue = correctedAddress ? { ...correctedAddress } : { ...this.actInfoCtrlFields?.seviceAddress?.value };
        this.actInfoCtrlFields?.serviceAddress?.patchValue({ ...correctedAddress }, { emitEvent: true });
        const accountInfo = this.formCtrlFields?.accountInfo?.value;
        const paymentRTDInfo = this._getRTDPaymentInfo();
        this.submitYourInfoForm.emit({
            accountInfo: { ...accountInfo, serviceAddress: this._getRTDAddress(serviceAddressValue) },
            paymentInfo: this.displayPaymentForm ? paymentRTDInfo : null,
            serviceAddress: {
                ...this._getRTDAddress(correctedAddress),
                avsvalidated,
                filled: true,
            },
        });
    }

    private _completeStep() {
        // TODO: determine if we still need this timer
        timer(1).subscribe(() => {
            if (this.isFollowOnChecked) {
                this._paymentCompleted();
            } else {
                this._withoutPaymentCompleted();
            }
        });

        const ccInfo = this.isFollowOnChecked ? this.formCtrlFields.paymentInfo.value : null;
        if (ccInfo) {
            const currentCCNum = ccInfo.ccNum.substr(-4);

            this.maskedNum = '************' + currentCCNum;
            this.maskedVisible = true;
        }
    }

    onAcceptCorrectedAddress(address, validated: boolean, avsWorkflow: AvsWorkflows) {
        switch (avsWorkflow) {
            case 'BILLING_ADDRESS_MODAL': {
                const serviceSameAsBilling = !this.showBillingAddressForm;
                this._editBillingAddress(address, validated);
                this.showInvalidBillingAddressError = false;
                if (!serviceSameAsBilling) {
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
        this._store.dispatch(setLoadYourInfoDataAsNotProcessing());
    }

    onEditExistingAddress(avsWorkflow: AvsWorkflows) {
        this._addressVerificationStateService.setAvsToEditAddressMode(avsWorkflow);
        this._store.dispatch(setLoadYourInfoDataAsNotProcessing());
    }

    onVerifyAddresModalCLosed(avsWorkflow: AvsWorkflows) {
        this.onEditExistingAddress(avsWorkflow);
    }

    onFollowOnCheckedClick(isChecked: boolean): void {
        this.isFollowOnChecked = isChecked;
        this.displayPaymentForm = isChecked;
        this._store.dispatch(isChecked ? setFollowOnOptionSelected() : setFollowOnOptionNotSelected());
    }

    onServiceAddressSameAsBillingCheckboxClick(isChecked: boolean): void {
        this.showBillingAddressForm = !isChecked;
        if (
            !isChecked &&
            this.actInfoCtrlFields &&
            this.actInfoCtrlFields.serviceAddress &&
            this.actInfoCtrlFields.billingAddress &&
            JSON.stringify(this.actInfoCtrlFields.serviceAddress.value) === JSON.stringify(this.formCtrlFields.billingAddress.value)
        ) {
            this.formCtrlFields.billingAddress.reset({
                addressLine1: '',
                city: '',
                state: '',
                zip: '',
            });
        }
        // TODO: figure out if we need to update SxmUiAddressComponent to be able to support it resetting error messages on all its fields
        //       It appears to not reset those when updateValueAndValidity is called...
        //       (may be due to the fact that this is a FormControl at parent level and not a FormGroup)
        this.formCtrlFields.billingAddress.updateValueAndValidity();
    }

    private _generateNewCCTransactionId(): void {
        this.transactionId = 'OAC-'.concat(uuid());
        this._store.dispatch(behaviorEventReactionForTransactionId({ transactionId: this.transactionId }));

        const newTransactionEvent = new CustomEvent(CustomEventNameEnum.NewPaymentTransaction, {
            detail: {
                id: this.transactionId,
                message: 'New credit card transaction event',
                time: new Date(),
            },
            bubbles: true,
            cancelable: true,
        });
        this._window.dispatchEvent(newTransactionEvent);
    }

    gotCaptcha() {
        this.captchaAnswer = null;
    }
}
