import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SxmLanguages } from '@de-care/app-common';
import { UpdateCheckoutAccount } from '@de-care/checkout-state';
import { DataLayerService, SharedEventTrackService } from '@de-care/data-layer';
import {
    AuthenticationTypeEnum,
    ComponentNameEnum,
    CustomerInfoData,
    DataIdentityService,
    DataLayerActionEnum,
    DataLayerDataTypeEnum,
    DataValidationService,
    FlowNameEnum,
    IdentityLookupPhoneOrEmailResponseModel,
    SubscriptionActionTypeEnum,
} from '@de-care/data-services';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';
import { AccountLookupOutput, StreamingEligibleSubscription, ValidateLpzFormComponent } from '@de-care/identification';
import { CollectForm } from '@de-care/purchase-state';
import { behaviorEventErrorFromUserInteraction, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { getCountry, sxmCountries } from '@de-care/shared/state-settings';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { SxmUiPasswordStrengthComponent } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { getSxmValidator, getValidateEmailByServerFn, getValidatePasswordServerFn } from '@de-care/shared/validation';
import { select, Store } from '@ngrx/store';
import { EMPTY, of, Subscription } from 'rxjs';
import { concatMap, take, tap } from 'rxjs/operators';
import { AccountCredentialsAndLookupStepStateService } from './account-credentials-and-lookup-step-state.service';
import * as uuid from 'uuid/v4';

export enum StepCompleteReasonEnum {
    EmailAccountFoundCreateLogin = 'Email Account Found - Create Login',
    EmailAccountFoundSignIn = 'Email Account Found - Sign In',
    EmailAccountNotFound = 'Email Account NOT Found',
    EmailAccountsFoundModalClosed = 'Email Account Found - Modal Closed without Selection',
    EmailAccountFoundAddSubscription = 'Email Account Found - Add Subscription',
}

export interface AccountLookupStepComplete extends AccountLookupOutput {
    completeReason: null | StepCompleteReasonEnum;
    selectedSubscription: IdentityLookupPhoneOrEmailResponseModel;
}

export const clearLpzFormAndLoading = (lpzFormComponent: ValidateLpzFormComponent) => {
    lpzFormComponent.clearForm();
    lpzFormComponent.loading = false;
};

@Component({
    selector: 'account-credentials-and-lookup-step',
    templateUrl: './account-credentials-and-lookup-step.component.html',
    styleUrls: ['./account-credentials-and-lookup-step.component.scss'],
    providers: [AccountCredentialsAndLookupStepStateService],
})
export class AccountCredentialsAndLookupStepComponent implements OnChanges {
    @Input() email: string;
    @Input() closeVerifyAccountModal: boolean;
    @Input() streaming = false;
    @Input() set currentLang(value: SxmLanguages) {
        if (!!value && this._currentLang !== value) {
            this._currentLang = value;
            this._setFormValidators();
        }
    }
    @Input() set isActive(value: boolean) {
        if (value && this.isLoading) {
            this.isLoading = false;
        }
    }

    @Input() set passwordInvalidError(value: boolean) {
        this.form?.controls?.password?.setErrors({ generic: value });
    }
    @Input() set passwordContainsPiiDataError(value: boolean) {
        this.form?.controls?.password?.setErrors({ piiData: value });
    }

    @Output() stepComplete: EventEmitter<AccountLookupStepComplete> = new EventEmitter<AccountLookupStepComplete>();
    @Output() subscribeLinkClicked = new EventEmitter<boolean>();
    @ViewChild('accountFoundModal') private readonly _accountFoundModal: SxmUiModalComponent;
    @ViewChild('verifyAccountModal') private readonly _verifyAccountModal: SxmUiModalComponent;
    @ViewChild('lpzForm') private readonly _lpzFormComponent: ValidateLpzFormComponent;
    @ViewChild('passwordFormField') private readonly _passwordFormField: SxmUiPasswordStrengthComponent;

    translateKeyPrefix = 'purchase.AccountCredentialsAndLookupStepComponent';
    subscriptions: StreamingEligibleSubscription[];
    subscriptionCount: number;
    form: FormGroup;
    submitted = false;
    emailServiceErrors = null;
    reservedWords = null;
    isLoading = false;
    alwaysDisplayPasswordHint = false;
    private _accountIsValidated = true;
    private _currentLang: SxmLanguages = 'en-US';
    private _countryForValidators: sxmCountries = 'us';
    private _emailValidationStatusSubscription: Subscription;
    accountCredentialsyourSubsModalAriaDescribedbyTextId = uuid();
    accountCredentialsModalAriaDescribedbyTextId = uuid();

    constructor(
        public readonly accountCredentialsAndLookupStepStateService: AccountCredentialsAndLookupStepStateService,
        private readonly _eventTrackingService: SharedEventTrackService,
        private readonly _dataLayerSrv: DataLayerService,
        private readonly _nonPiiSrv: NonPiiLookupWorkflow,
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _dataValidationService: DataValidationService,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _dataIdentityService: DataIdentityService,
        private readonly _dataLayerService: DataLayerService
    ) {
        this.form = this._formBuilder.group({
            email: [this.email],
            password: [],
        });
        this._store.pipe(select(getCountry), take(1)).subscribe((country) => {
            this._countryForValidators = country;
        });
        this._setFormValidators();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.closeVerifyAccountModal && !!changes.closeVerifyAccountModal.currentValue) {
            clearLpzFormAndLoading(this._lpzFormComponent);
            this._verifyAccountModal.close();
        }
    }

    private _setFormValidators(): void {
        this.form.controls.email.setValidators(getSxmValidator('emailForLookup', this._countryForValidators, this._currentLang));
        this.form.controls.email.clearAsyncValidators();
        this.form.controls.password.setAsyncValidators(getValidatePasswordServerFn(this._dataValidationService, () => this._changeDetectorRef.markForCheck()));
    }

    onSubmit() {
        this.form.markAsDirty();
        this.submitted = true;
        if (this.form.valid) {
            this.isLoading = true;
            if (this._passwordFormField && this._passwordFormField.displayPasswordHint) {
                this.alwaysDisplayPasswordHint = false;
                this._passwordFormField.hidePasswordHint();
            }
            // eventually move this to a domain workflow
            this._dataIdentityService.lookupCustomerEmail({ email: this.form.value.email }).subscribe(
                (result) => {
                    this.isLoading = false;
                    // eventually replace this with dispatch of behavior event reaction
                    this._logCustomerFoundToDataLayer(this.form.value.email);
                    this.onContinue({
                        attemptedEmail: this.form.value.email,
                        emailValid: true,
                        accountData: result,
                    });
                },
                (error) => {
                    this.emailServiceErrors = error;
                    this.isLoading = false;
                    this._changeDetectorRef.markForCheck();
                }
            );
        } else {
            if (this.form.controls.email.errors) {
                this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Auth - Missing or invalid email' }));
            }
            if (this.form.controls.password.errors) {
                this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Checkout - Missing or invalid password' }));
            }
        }
    }

    onContinue(payload: AccountLookupOutput): void {
        this.accountCredentialsAndLookupStepStateService.updateStateData({
            attemptedEmail: payload.attemptedEmail || '',
            emailValid: payload.emailValid || false,
            accountData: payload.accountData || [],
        });
        if (payload.accountData) {
            this.subscriptionCount = (
                payload.accountData.filter((item) => item.streamingService && item.streamingService.status === 'Active' && !item.streamingService.randomCredentials) || []
            ).length;
        }
        this.email = payload.attemptedEmail;
        this.accountCredentialsAndLookupStepStateService.hasQualifyingSubscriptions$
            .pipe(
                take(1),
                concatMap((hasQualifyingSubscriptions) => {
                    if (hasQualifyingSubscriptions) {
                        this.onAccountFound();
                    } else {
                        this.onAccountNotFound();
                    }
                    return of(EMPTY);
                })
            )
            .subscribe();
    }

    onAccountFound(): void {
        const componentName: ComponentNameEnum = ComponentNameEnum.SignIn;
        this._accountFoundModal.open();
        this._dataLayerSrv.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, componentName, {
            flowName: FlowNameEnum.Authenticate,
            componentName: componentName,
            subscriptionCount: this.subscriptionCount,
        });
        // "subscribeLinkClicked" gets passed to payment-info.component,
        // If true, it'll notify Analytics
        this.subscribeLinkClicked.emit(true);
    }

    onAccountNotFound(): void {
        this.accountCredentialsAndLookupStepStateService.updateStateData({ completeReason: StepCompleteReasonEnum.EmailAccountNotFound });
        this.exitStep();
    }

    onAccountFoundModalClose(): void {
        this.accountCredentialsAndLookupStepStateService.updateStateData({ completeReason: StepCompleteReasonEnum.EmailAccountsFoundModalClosed });
        this.form.controls.email.setErrors({ usernameInUse: true });
        this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Checkout - Username or email already in use' }));
        this.isLoading = false;
        this._changeDetectorRef.markForCheck();
    }

    onAccountSubscription(subscriptionId: string): void {
        this.accountCredentialsAndLookupStepStateService.updateStateData({ completeReason: StepCompleteReasonEnum.EmailAccountFoundAddSubscription });
        this._accountFoundModal.close();
        this._eventTrackingService.track('signin-clicked', { componentName: ComponentNameEnum.SignIn });
        this._accountIsValidated = false;
        this.exitStep();
        this._nonPiiSrv
            .build({
                subscriptionId,
            })
            .pipe(tap((account) => this._store.dispatch(UpdateCheckoutAccount({ payload: account }))))
            .subscribe(() => {
                this._verifyAccountModal.open();
                this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Overlay:VerifyStreamingCustomer' }));
            });
    }

    onSubscriptionAction(subscription: IdentityLookupPhoneOrEmailResponseModel) {
        this.accountCredentialsAndLookupStepStateService.updateStateData({
            selectedSubscription: subscription,
        });
        switch (subscription.subActionType) {
            case SubscriptionActionTypeEnum.SIGN_IN:
                this.accountCredentialsAndLookupStepStateService.updateStateData({ completeReason: StepCompleteReasonEnum.EmailAccountFoundSignIn });
                this._accountFoundModal.close();
                this.exitStep();
                return;
            case SubscriptionActionTypeEnum.CREATE_LOGIN:
                this.accountCredentialsAndLookupStepStateService.updateStateData({ completeReason: StepCompleteReasonEnum.EmailAccountFoundCreateLogin });
                this._accountFoundModal.close();
                this._accountIsValidated = false;
                this._verifyAccountModal.open();
                return;
            case SubscriptionActionTypeEnum.ADD_SUB:
                this._eventTrackingService.track(DataLayerActionEnum.SubscribeLink, { componentName: ComponentNameEnum.AccountLookup });
                this.onAccountSubscription(subscription.id);
                return;
        }
    }

    onVerifyAccountModalClose(): void {
        clearLpzFormAndLoading(this._lpzFormComponent);
        this.exitStep();
    }

    backToAccountFound() {
        this._verifyAccountModal.close();
        this.onAccountFound();
    }

    onAccountVerified(): void {
        this._accountIsValidated = true;
        this.exitStep({ skipEmailValidation: true });
    }

    onAccountInvalid(): void {
        this._accountIsValidated = false;
    }

    exitStep(options?: { skipEmailValidation: boolean }): void {
        if (this._accountIsValidated) {
            if (options?.skipEmailValidation) {
                this._emitStepCompleted();
            } else {
                this.isLoading = true;
                // We set the server side validator for validity of email as username.
                this.form.controls.email.setAsyncValidators(getValidateEmailByServerFn(this._dataValidationService, 0, this._changeDetectorRef, false, true));
                // We subscribe to the status changes for the email field to know when async validation is completed.
                this._emailValidationStatusSubscription = this.form.controls.email.statusChanges.subscribe((status) => {
                    switch (status) {
                        case 'VALID':
                            this._resetFormValidatorsAndUnsubscribeEmailValidationStatus();
                            this.submitted = false;
                            this._store.dispatch(
                                CollectForm({
                                    payload: {
                                        email: this.form.value.email,
                                        password: this.form.value.password,
                                    },
                                })
                            );
                            this._emitStepCompleted();
                            this._changeDetectorRef.markForCheck();
                            break;
                        case 'INVALID':
                            this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Checkout - Missing or invalid email' }));
                            this._resetFormValidatorsAndUnsubscribeEmailValidationStatus();
                            this.isLoading = false;
                            this._changeDetectorRef.markForCheck();
                            break;
                    }
                });
                // We tell the form field to run validation (to kick off the server side validity check).
                this.form.controls.email.updateValueAndValidity();
            }
        }
    }

    private _resetFormValidatorsAndUnsubscribeEmailValidationStatus() {
        // We reset form validators to initial state after running the server side email validation that
        //  checks for validity of using email as username.
        this._setFormValidators();
        // We unsubscribe from the email validation status changes as we no longer want to monitor at this point
        //  since we reset the validators above.
        this._emailValidationStatusSubscription.unsubscribe();
    }

    private _emitStepCompleted() {
        this.accountCredentialsAndLookupStepStateService.stepInfo$.pipe(take(1)).subscribe((stepInfo) => {
            this.stepComplete.emit(stepInfo);
        });
    }

    /**
     * @deprecated remove this logic in favor of dispatching behavior event reaction
     */
    private _logCustomerFoundToDataLayer(email: string): void {
        const customerInfoObj: CustomerInfoData = this._dataLayerService.getData(DataLayerDataTypeEnum.CustomerInfo) || {};
        customerInfoObj.email = email;
        customerInfoObj.authenticationType = AuthenticationTypeEnum.AccountLookup;
        this._dataLayerService.update(DataLayerDataTypeEnum.CustomerInfo, customerInfoObj);
    }

    mouseEnterOnContinueButton() {
        if (this._passwordFormField && this._passwordFormField.displayPasswordHint) {
            this.alwaysDisplayPasswordHint = true;
        }
    }

    mouseLeaveOnContinueButton() {
        this.alwaysDisplayPasswordHint = false;
    }
}
