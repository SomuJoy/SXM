import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { behaviorEventErrorsFromUserInteraction, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { SxmUiPasswordStrengthComponent } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { Store } from '@ngrx/store';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid/v4';
import { SubscriptionSummaryData } from '../../models';
import { OpenNativeAppService } from '@de-care/domains/utility/state-native-app-integration';
import { SxmValidators } from '@de-care/shared/forms-validation';
export interface CredentialData {
    radioId: string;
    username: string;
    password: string;
    email: string;
    synchronizeAccountEmail: boolean;
}

export interface SetupSubscriptionCredentialsFormComponentApi {
    completedProcessing(): void;
    showSystemError(): void;
    showUsernameExistsError(): void;
    showInvalidPasswordError(): void;
    showPasswordContainsPiiDataError(): void;
}

@Component({
    selector: 'setup-subscription-credentials-form',
    templateUrl: './setup-subscription-credentials-form.component.html',
    styleUrls: ['./setup-subscription-credentials-form.component.scss'],
})
export class SetupSubscriptionCredentialsFormComponent implements OnInit, AfterViewInit, OnDestroy, SetupSubscriptionCredentialsFormComponentApi {
    @Input() signInLinkOverride: string;
    private readonly _window: Window;
    @Input() subscription: SubscriptionSummaryData;
    @Input() emailToPrefill: string;
    @Input() usernameIsReadonly = false;
    @Input() readonlyEmail: string;
    @Input() isTokenizationFlow: boolean;
    @Output() credentialsReadyToProcess = new EventEmitter<CredentialData>();
    @ViewChild('UpdateEmailModal') private readonly _UpdateEmailModal: SxmUiModalComponent;
    @ViewChild('SubscribeEmailModal') private readonly _SubscribeEmailModal: SxmUiModalComponent;
    @ViewChild('passwordControl') private _passwordFormField: SxmUiPasswordStrengthComponent;
    translateKeyPrefix = 'DomainsAccountUiSubscriptionStreamingModule.SetupSubscriptionCredentialsFormComponent.';
    loading$ = new BehaviorSubject(false);
    reservedWords: string[] = [];
    readonly passwordElementId = uuid();
    credentialsFormGroup: FormGroup;
    submitted = false;
    isUserNameExist$ = new BehaviorSubject(false);
    isSystemError$ = new BehaviorSubject(false);
    isInvalidPasswordError$ = new BehaviorSubject(false);
    isPasswordContainsPiiDataError$ = new BehaviorSubject(false);
    private _asyncValidationPendingSubscription: Subscription;
    private _unsubscribe$ = new Subject();
    alwaysDisplayPasswordHint = false;
    @Input() formFieldsToShow = { email: false, username: false };

    constructor(
        private readonly _store: Store,
        private _formBuilder: FormBuilder,
        private readonly _openNativeAppService: OpenNativeAppService,
        private _sxmValidators: SxmValidators
    ) {
        this._window = document && document.defaultView;
    }

    ngOnDestroy(): void {
        if (this._unsubscribe$) {
            this._unsubscribe$.next();
            this._unsubscribe$.complete();
        }
    }

    completedProcessing(): void {
        this.loading$.next(false);
    }

    showSystemError(): void {
        this.isSystemError$.next(true);
    }
    showUsernameExistsError(): void {
        this.isUserNameExist$.next(true);
    }

    showInvalidPasswordError(): void {
        this.isInvalidPasswordError$.next(true);
    }

    showPasswordContainsPiiDataError(): void {
        this.isPasswordContainsPiiDataError$.next(true);
    }

    ngOnInit() {
        this.credentialsFormGroup = this._formBuilder.group({
            username: [
                this.emailToPrefill,
                {
                    validators: this._sxmValidators.optionalUsername,
                    updateOn: 'blur',
                },
            ],
            email: [
                this.emailToPrefill,
                {
                    validators: this._sxmValidators.optionalEmail,
                    updateOn: 'blur',
                },
            ],
            password: [
                null,
                {
                    validators: this._sxmValidators.password,
                    updateOn: 'blur',
                },
            ],
        });
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'setupcredentials' }));
    }

    onSubmitClick() {
        this.credentialsFormGroup.markAllAsTouched();
        this.submitted = true;
        this.loading$.next(true);
        this.isSystemError$.next(false);
        this.isUserNameExist$.next(false);
        this.isInvalidPasswordError$.next(false);
        this.isPasswordContainsPiiDataError$.next(false);
        if (this.credentialsFormGroup.pending) {
            this._asyncValidationPendingSubscription = this.credentialsFormGroup.statusChanges
                .pipe(
                    filter((status) => status !== 'PENDING'),
                    takeUntil(this._unsubscribe$)
                )
                .subscribe(() => {
                    this._validateAndComplete();
                });
        } else {
            this._validateAndComplete();
        }
    }

    onSignIn() {
        if (this.signInLinkOverride) {
            this._window.open(this.signInLinkOverride, '_self');
        } else {
            this._openNativeAppService.openSxmPlayerApp();
        }
    }

    private _validateAndComplete(): void {
        if (this._asyncValidationPendingSubscription) {
            this._asyncValidationPendingSubscription.unsubscribe();
        }
        if (this.credentialsFormGroup.valid) {
            this.loading$.next(true);
            if (this._passwordFormField && this._passwordFormField.displayPasswordHint) {
                this.alwaysDisplayPasswordHint = false;
                this._passwordFormField.hidePasswordHint();
            }
            this.isSystemError$.next(false);
            this.isUserNameExist$.next(false);
            if (
                (!this.credentialsFormGroup.controls.username.value && !this.credentialsFormGroup.controls.email.value) ||
                !this.credentialsFormGroup.controls.password.value
            ) {
                this.loading$.next(false);
                return;
            }
            this._notifyCredentialsReady(this.emailToPrefill, false);

            // if (this.subscription.email === this.emailToPrefill) {
            //     this._notifyCredentialsReady(this.emailToPrefill, false);
            // } else {
            //     if (this.subscription.email?.length) {
            //         this._UpdateEmailModal.open();
            //         this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'overlay:emailupdate' }));
            //     } else {
            //         this._SubscribeEmailModal.open();
            //     }
            // }
        } else {
            const errors = [];
            const usernameControl = this.credentialsFormGroup.controls.username;
            const emailControl = this.credentialsFormGroup.controls.email;
            const passwordControl = this.credentialsFormGroup.controls.password;
            // TODO: check with Launch team to see if we can change these to not have Registration text in them (use something like Streaming Credentials)
            if (usernameControl.hasError('required')) {
                errors.push('Registration - Missing username');
            }
            if (emailControl.hasError('required')) {
                errors.push('Registration - Missing email');
            }
            if (passwordControl.hasError('required')) {
                errors.push('Registration - Missing password');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this.loading$.next(false);
        }
    }

    onModalClosed() {
        this.loading$.next(false);
    }

    openEmailUpdateModal() {
        this._notifyCredentialsReady(this.emailToPrefill, true);
        this._UpdateEmailModal.close();
    }

    closeModal() {
        this._notifyCredentialsReady(this.subscription.email, false);
        this._UpdateEmailModal.close();
    }

    goToConfirmationPage() {
        this._notifyCredentialsReady(this.emailToPrefill, true);
        this._SubscribeEmailModal.close();
    }

    closeConfirmationModal() {
        this._notifyCredentialsReady(this.emailToPrefill, false);
        this._SubscribeEmailModal.close();
    }

    private _notifyCredentialsReady(email: string, synchronizeAccountEmail: boolean) {
        this.credentialsReadyToProcess.emit({
            radioId: this.subscription.last4DigitsOfRadioId,
            username: this.credentialsFormGroup.value.username ? this.credentialsFormGroup.value.username : this.credentialsFormGroup.value.email,
            password: this.credentialsFormGroup.value.password,
            email: email ? email : this.credentialsFormGroup.value.email ? this.credentialsFormGroup.value.email : null,
            synchronizeAccountEmail,
        });
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
