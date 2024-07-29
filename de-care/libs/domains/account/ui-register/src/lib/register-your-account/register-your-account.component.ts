// ===============================================================================
// Angular
import { Component, ViewChild, Input, OnChanges, ChangeDetectorRef, Output, EventEmitter, SimpleChanges, SimpleChange, ElementRef, Inject } from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, NgForm, AbstractControl, FormControl } from '@angular/forms';

// ===============================================================================
// Import Models
import { RegisterDataModel, AccountProfile, ErrorTypeEnum, SecurityQuestionsModel, DataValidationService } from '@de-care/data-services';

// ===============================================================================
// Local Dependencies
import { controlIsInvalid, getValidateUserNameByServerFn, getSxmValidator, getValidatePasswordServerFn } from '@de-care/shared/validation';
import { DataLayerService, FrontEndErrorModel, FrontEndErrorEnum } from '@de-care/data-layer';
import { SxmUiPasswordStrengthComponent } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

export interface MinimumAccountData {
    email: string;
    useEmailAsUsername: boolean;
    firstName: string;
    hasUserCredentials: boolean;
    hasExistingAccount: boolean;
    isOfferStreamingEligible?: boolean;
    isEligibleForRegistration?: boolean;
    subscriptionId: string;
}

export interface PasswordError {
    reservedWords?: string[];
    genericError?: boolean;
}

interface RegisterParams {
    email?: string;
    security?: SecurityQuestionsModel[];
}

export class RegisterCredentialsState {
    static None = new RegisterCredentialsState('None', false, false);
    static All = new RegisterCredentialsState('All', true, true);
    static PasswordOnly = new RegisterCredentialsState('PasswordOnly', true, false);
    static UsernameOnly = new RegisterCredentialsState('UsernameOnly', false, true);
    static QuestionsOnly = new RegisterCredentialsState('QuestionsOnly', false, false);

    private constructor(private readonly key: string, public readonly showPassword: boolean, public readonly showUsername: boolean) {}

    toString() {
        return this.key;
    }
}

enum RegisterAccountTypeEnum {
    Audio = 'AUDIO',
    Streaming = 'STREAMING',
    TrialActivation = 'TRIAL_ACTIVATION',
    PyP = 'PYP',
}

export const getRegisterAccountType = (isTrialActivation, isStreamingEligible): RegisterAccountTypeEnum => {
    if (isTrialActivation) {
        return RegisterAccountTypeEnum.TrialActivation;
    } else {
        return isStreamingEligible ? RegisterAccountTypeEnum.Streaming : RegisterAccountTypeEnum.Audio;
    }
};

@Component({
    selector: 'register-your-account',
    templateUrl: './register-your-account.component.html',
    styleUrls: ['./register-your-account.component.scss'],
})
export class SharedRegisterYourAccountComponent implements OnChanges {
    //================================================
    //===                Decorators                ===
    //================================================
    @ViewChild('paymentFormRef') form: NgForm;
    @ViewChild('registerButtonRef', { read: ElementRef }) private registerButtonRef: ElementRef;
    @ViewChild('passwordComponentRef') private passwordComponentRef: SxmUiPasswordStrengthComponent;

    @Input() securityQuestions: SecurityQuestionsModel[];

    @Input() registrationCompleted: boolean;
    @Input() account: MinimumAccountData;

    // TODO: Can we use async validator here?

    @Input() set passwordError(passwordError: PasswordError) {
        this.reservedWords = null;
        this.passwordGenericError = false;
        if (passwordError) {
            this.isProcessingRegistration$.next(false);
            if (passwordError && passwordError.reservedWords) {
                this.reservedWords = passwordError.reservedWords;
            } else if (passwordError && passwordError.genericError) {
                this.passwordGenericError = true;
            }
        }
    }

    @Input()
    credentialState: RegisterCredentialsState = RegisterCredentialsState.All;

    @Input() isTrialActivation: boolean;
    @Input() isTwoFactorAuthNeeded = false;
    @Input() isPyp = false;

    @Output() register: EventEmitter<RegisterDataModel> = new EventEmitter<RegisterDataModel>();
    @Output() registerClicked: EventEmitter<any> = new EventEmitter<any>();

    // CONTEXT:
    // -- STREAMING ELIGIBLE = TRUE,
    // -- PLAN ALREADY HAVE STREAMING CREDENTIALS? "account.hasLoginCredentials"

    //================================================
    //===                Variables                 ===
    //================================================
    registerFg: FormGroup;
    displaysecurityQuestions: boolean = false;
    formSent: boolean = false;
    submitted: boolean = false;
    isProcessingRegistration$ = new BehaviorSubject<boolean>(false);
    registerObject: RegisterParams;
    registerData: RegisterDataModel;
    registerResponse: AccountProfile;
    passwordHintVisible = false;
    reservedWords: string[];
    passwordGenericError = false;
    // showUsername = false;
    CredentialStates = RegisterCredentialsState;
    alwaysDisplayPasswordHint = false;

    controlIsInvalid = controlIsInvalid(() => {
        return this.submitted;
    });
    registerAccountType: string;
    RegisterAccountTypeEnum = RegisterAccountTypeEnum;
    private _passwordErrors;
    private _window: Window;

    //================================================
    //===            Lifecycle events              ===
    //================================================
    constructor(
        private _fb: FormBuilder,
        private _dataLayerSrv: DataLayerService,
        private _dataValidationSrv: DataValidationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private readonly _store: Store,
        @Inject(DOCUMENT) document: Document
    ) {
        this._window = document.defaultView;
    }

    ngOnChanges(changes: SimpleChanges) {
        function hasDelta(change: SimpleChange): boolean {
            // return change && (change.isFirstChange() || (change.currentValue && change.currentValue !== change.previousValue));
            return change && change.currentValue;
        }

        const hasCredentialStateChanges = hasDelta(changes.credentialState);
        const hasSecurityQuestionsChange = hasDelta(changes.securityQuestions);
        const hasAccountChange = hasDelta(changes.account);

        this.initializeForm();

        if (hasCredentialStateChanges || hasAccountChange) {
            this._initUserNameFields();
            this._initPasswordField();
        }
        if (hasSecurityQuestionsChange) {
            this._initSecurityQuestionsFields();
        }
        this.registerObject = { email: this.account && this.account.email, security: this.securityQuestions };

        if (changes.account && changes.account.currentValue) {
            this.registerAccountType = getRegisterAccountType(
                !!changes.isTrialActivation && changes.isTrialActivation.currentValue,
                changes.account.currentValue.isOfferStreamingEligible
            );
        }
    }

    //================================================
    //===              Helper Methods              ===
    //================================================
    initializeForm() {
        !this.registerFg && (this.registerFg = this._fb.group({}));
    }

    get registerFgControls(): { [key: string]: AbstractControl } {
        return this.registerFg.controls;
    }

    registerFormSubmit = () => {
        this.submitted = true;
        this.isProcessingRegistration$.next(true);
        this.checkFormControlsAndUpdateValidities(this.registerFg);
    };

    registerFormContinue() {
        this.form.ngSubmit.emit();
        this.registerClicked.emit();

        this.processFormValidation();

        this.registerFg.statusChanges
            .pipe(
                filter((status) => status !== 'PENDING'),
                take(1)
            )
            .subscribe(() => this.processFormValidation());
    }

    resetLoader() {
        this.isProcessingRegistration$.next(false);
        this._changeDetectorRef.markForCheck();
    }

    processFormValidation() {
        this.isProcessingRegistration$.next(true);

        if (this.registerFg.invalid) {
            const registerFormControls = this.registerFgControls;

            if (this.credentialState.showUsername) {
                if (registerFormControls.userName.hasError('required')) {
                    this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.RegistrationMissingUsername));
                }
                if (registerFormControls.userName.hasError('usernameInUse')) {
                    this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.RegistrationUsernameAlreadyUsed));
                }
                if (registerFormControls.userName.hasError('invalidUsername')) {
                    this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.RegistrationUsernameInvalid));
                }
            }

            if (this.credentialState.showPassword) {
                if (registerFormControls.password.hasError('required')) {
                    this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.RegistrationMissingPassword));
                }
                if (registerFormControls.password.hasError('policy')) {
                    this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.RegistrationInvalidPassCriteria));
                }
                if (registerFormControls.password.hasError('length')) {
                    this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.RegistrationInvalidPassShort));
                }
                if (registerFormControls.password.hasError('reservedWords')) {
                    this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.RegistrationInvalidPassReserveWord));
                }
            }

            if (this._hasSecurityQuestions()) {
                if (
                    (this.controlIsInvalid(registerFormControls.question0) && registerFormControls.question0.hasError('required')) ||
                    (this.controlIsInvalid(registerFormControls.question1) && registerFormControls.question1.hasError('required')) ||
                    (this.controlIsInvalid(registerFormControls.question2) && registerFormControls.question2.hasError('required'))
                ) {
                    this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.RegistrationInvalidSecurityQ));
                }
                if (
                    this.controlIsInvalid(registerFormControls.answer0) ||
                    this.controlIsInvalid(registerFormControls.answer1) ||
                    this.controlIsInvalid(registerFormControls.answer2)
                ) {
                    this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.RegistrationInvalidSecurityQA));
                }
            }
            this.resetLoader();
            return;
        }
        if (this.registerFg.valid) {
            const answerArray = [];
            if (this._hasSecurityQuestions()) {
                for (let i = 0; i < 3; i++) {
                    const question = {
                        id: this.registerFgControls[`question${i}`].value,
                        answer: this.registerFgControls[`answer${i}`].value,
                    };
                    answerArray.push(question);
                }
            }
            this.registerData = {
                password: this.credentialState.showPassword ? this.registerFgControls.password.value : undefined,
                securityQuestions: answerArray,
            };

            if (this.credentialState.showUsername) {
                this.registerData = {
                    ...this.registerData,
                    userName: this.account.useEmailAsUsername ? this.account.email : this.registerFgControls.userName.value,
                };
            } else {
                if (this.account.email) {
                    this.registerData = { ...this.registerData, userName: this.account.email };
                }
            }

            // Dispatch will register the account and dispatch a action on success
            this.register.emit(this.registerData);
            this.resetLoader();
        }
    }

    checkFormControlsAndUpdateValidities(form: FormGroup) {
        Object.keys(form.controls).forEach((formControl) => {
            form.controls[formControl].updateValueAndValidity();
        });
    }

    windowEventListener(event) {
        this.registerFg.controls['password'].setErrors(this._passwordErrors);
        this.registerFg.controls['password'].updateValueAndValidity();
        this._changeDetectorRef.detectChanges();
        this._passwordErrors = null;
        this._window.removeEventListener('click', this.windowEventListenerScopeProxy);
    }

    windowEventListenerScopeProxy = (event) => {
        this.windowEventListener(event);
    };

    mouseEnterOnRegisterButton() {
        if (this.passwordComponentRef && this.passwordComponentRef.displayPasswordHint) {
            this.registerButtonRef.nativeElement.focus();
            this.alwaysDisplayPasswordHint = true;

            this.registerFg.controls['password'].updateValueAndValidity(); // { required : true }

            // memoize the error in the passwordError
            this._passwordErrors = this.registerFg.controls['password'].errors;

            // set it to null
            this.registerFg.controls['password'].setErrors(null);
        }
    }

    mouseLeaveOnContinueButton() {
        if (this.passwordComponentRef && this.passwordComponentRef.displayPasswordHint) {
            this.alwaysDisplayPasswordHint = false;
            this._window.removeEventListener('click', this.windowEventListenerScopeProxy);
            this._window.addEventListener('click', this.windowEventListenerScopeProxy);
        }
    }

    private _hasSecurityQuestions(): boolean {
        return this.securityQuestions && this.securityQuestions.length > 0;
    }

    private _initPasswordField(): void {
        const passwordControl = this.registerFg.get('password');
        if (this.credentialState.showPassword && !passwordControl) {
            const passwordConfig = new FormControl(null, { validators: Validators.required, updateOn: 'blur' });
            this.registerFg.addControl('password', passwordConfig);
            this.registerFg.controls.password.setAsyncValidators(getValidatePasswordServerFn(this._dataValidationSrv, () => this._changeDetectorRef.markForCheck()));
        } else if (!this.credentialState.showPassword && passwordControl) {
            this.registerFg.removeControl('password');
        }
    }

    private _initUserNameFields(): void {
        const userNameControl = this.registerFg.get('userName');
        if (this.credentialState.showUsername && !userNameControl) {
            const usernameConfig = new FormControl(this.account.useEmailAsUsername ? this.account.email : null, {
                validators: getSxmValidator('registrationUserName'),
                asyncValidators: [getValidateUserNameByServerFn(this._dataValidationSrv, this.account.useEmailAsUsername, 0, this._changeDetectorRef)],
                updateOn: 'blur',
            });
            this.registerFg.addControl('userName', usernameConfig);
        } else if (!this.credentialState.showUsername && userNameControl) {
            this.registerFg.removeControl('userName');
        }
    }

    private _initSecurityQuestionsFields(): void {
        const secQuestion0 = this.registerFg.get('question0');
        const hasSecQuestions = this._hasSecurityQuestions();
        if (hasSecQuestions && !secQuestion0) {
            this.displaysecurityQuestions = true;
            this._addSecurityQuestionsFields(3);
        } else if (!hasSecQuestions && secQuestion0) {
            this.displaysecurityQuestions = false;
            this._removeSecurityQuestionsFields();
        }
    }

    private _addSecurityQuestionsFields(questionsQuantity: number): void {
        for (let i = questionsQuantity; i--; ) {
            const question = new FormControl(null, Validators.required);
            const answer = new FormControl(null, { validators: Validators.required, updateOn: 'blur' });
            this.registerFg.addControl(`question${i}`, question);
            this.registerFg.addControl(`answer${i}`, answer);
        }
    }

    private _removeSecurityQuestionsFields(): void {
        this.registerFg.removeControl('question0');
        this.registerFg.removeControl('answer0');
        this.registerFg.removeControl('question1');
        this.registerFg.removeControl('answer1');
        this.registerFg.removeControl('question2');
        this.registerFg.removeControl('answer2');
    }
}
