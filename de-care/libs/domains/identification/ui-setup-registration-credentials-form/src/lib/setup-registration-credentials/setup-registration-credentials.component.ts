import {
    Component,
    ViewChild,
    Input,
    OnChanges,
    ChangeDetectorRef,
    SimpleChanges,
    SimpleChange,
    ElementRef,
    AfterViewInit,
    OnDestroy,
    Output,
    EventEmitter,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators, NgForm, AbstractControl, FormControl } from '@angular/forms';

import { RegisterDataModel, AccountProfile, ErrorTypeEnum, SecurityQuestionsModel, DataValidationService, DataLayerActionEnum } from '@de-care/data-services';

import { controlIsInvalid, getValidateUserNameByServerFn, getSxmValidator, getValidatePasswordServerFn } from '@de-care/shared/validation';
import { DataLayerService, FrontEndErrorModel, FrontEndErrorEnum } from '@de-care/data-layer';
import { SxmUiPasswordStrengthComponent } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { BehaviorSubject, of, Subject, timer } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { RegisterWorkflowService } from '@de-care/domains/account/state-account';

export interface MinimumAccountData {
    email: string;
    useEmailAsUsername: boolean;
    firstName: string;
    hasUserCredentials: boolean;
    hasExistingAccount: boolean;
    isOfferStreamingEligible?: boolean;
    isEligibleForRegistration?: boolean;
    subscriptionId: string;
    maskedEmail?: string;
}

export interface PasswordError {
    reservedWords?: string[];
    genericError?: boolean;
}

interface RegisterParams {
    email?: string;
    security?: SecurityQuestionsModel[];
}

export class SetupRegistrationCredentialsState {
    static None = new SetupRegistrationCredentialsState('None', false, false);
    static All = new SetupRegistrationCredentialsState('All', true, true);
    static PasswordOnly = new SetupRegistrationCredentialsState('PasswordOnly', true, false);
    static UsernameOnly = new SetupRegistrationCredentialsState('UsernameOnly', false, true);
    static QuestionsOnly = new SetupRegistrationCredentialsState('QuestionsOnly', false, false);

    private constructor(private readonly key: string, public readonly showPassword: boolean, public readonly showUsername: boolean) {}

    toString() {
        return this.key;
    }
}

enum RegisterAccountTypeEnum {
    Audio = 'AUDIO',
    Streaming = 'STREAMING',
    TrialActivation = 'TRIAL_ACTIVATION',
}

export const getRegisterAccountType = (isTrialActivation, isStreamingEligible): RegisterAccountTypeEnum => {
    if (isTrialActivation) {
        return RegisterAccountTypeEnum.TrialActivation;
    } else {
        return isStreamingEligible ? RegisterAccountTypeEnum.Streaming : RegisterAccountTypeEnum.Audio;
    }
};

@Component({
    selector: 'setup-registration-credentials',
    templateUrl: './setup-registration-credentials.component.html',
    styleUrls: ['./setup-registration-credentials.component.scss'],
})
export class SetupRegistrationCredentialsComponent implements OnChanges, AfterViewInit, OnDestroy {
    translatePrefixKey = 'DomainsIdentificationUiSetupRegistrationCredentialsFormModule.SetupRegistrationCredentialsComponent.';
    //================================================
    //===                Decorators                ===
    //================================================
    @ViewChild('paymentFormRef') form: NgForm;
    @ViewChild('registerButtonRef', { read: ElementRef }) private registerButtonRef: ElementRef;
    @ViewChild('passwordComponentRef') private passwordComponentRef: SxmUiPasswordStrengthComponent;

    @Input() securityQuestions: SecurityQuestionsModel[];

    registrationCompleted: boolean = false;
    @Input() account: MinimumAccountData;

    @Output() credentialsCreated = new EventEmitter();

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
    credentialState: SetupRegistrationCredentialsState = SetupRegistrationCredentialsState.All;

    @Input() isTrialActivation: boolean;

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
    showUsername = false;
    CredentialStates = SetupRegistrationCredentialsState;
    alwaysDisplayPasswordHint = false;

    controlIsInvalid = controlIsInvalid(() => {
        return this.submitted;
    });
    registerAccountType: string;
    RegisterAccountTypeEnum = RegisterAccountTypeEnum;

    isMouseInSubmitButtonZone$ = new BehaviorSubject<'ENTERED' | 'LEFT'>('LEFT');
    clickedSubmitButton$ = new Subject<boolean>();
    private destroy$ = new Subject<boolean>();
    passwordStrengthEventsHaveEvaluated$ = new BehaviorSubject<number>(0);

    //================================================
    //===            Lifecycle events              ===
    //================================================
    constructor(
        private _fb: FormBuilder,
        private _dataLayerSrv: DataLayerService,
        private _dataValidationSrv: DataValidationService,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _registerWorkflowService: RegisterWorkflowService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        const hasDelta = (change: SimpleChange): boolean => {
            return change && change.currentValue;
        };

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
        this.registerObject = {
            email: this.account?.maskedEmail ? this.account?.maskedEmail : this.account?.email,
            security: this.securityQuestions,
        };

        if (changes.account && changes.account.currentValue) {
            this.registerAccountType = getRegisterAccountType(
                !!changes.isTrialActivation && changes.isTrialActivation.currentValue,
                changes.account.currentValue.isOfferStreamingEligible
            );
        }
    }

    ngAfterViewInit() {
        this._dataLayerSrv.sendExplicitEventTrackEvent(DataLayerActionEnum.PresentRegistration, null);

        this.isMouseInSubmitButtonZone$
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.form?.controls?.['password']?.untouched),
                switchMap((mouseStatus) => {
                    if (mouseStatus === 'ENTERED') {
                        this.passwordStrengthEventsHaveEvaluated$.next(-1);
                        return this.clickedSubmitButton$.pipe(
                            filter(Boolean),
                            switchMap(() => timer(0).pipe(tap(() => this.passwordStrengthEventsHaveEvaluated$.next(1))))
                        );
                    }

                    this.passwordStrengthEventsHaveEvaluated$.next(0);
                    return of(null);
                })
            )
            .subscribe();
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
    };

    registerFormContinue(): void {
        this.form.ngSubmit.emit();
        this.clickedSubmitButton$.next(true);
        this._checkFormControlsAndUpdateValidities();
        if (this.registerFg.status === 'PENDING') {
            this.registerFg.statusChanges
                .pipe(
                    filter((status) => status !== 'PENDING'),
                    take(1)
                )
                .subscribe(() => this._processFormValidation());
        } else {
            this._processFormValidation();
        }
    }

    private _checkFormControlsAndUpdateValidities() {
        Object.keys(this.registerFg.controls).forEach((formControl) => {
            this.registerFg.controls[formControl].updateValueAndValidity();
        });
        this._changeDetectorRef.markForCheck();
    }

    resetLoader() {
        this.isProcessingRegistration$.next(false);
        this._changeDetectorRef.markForCheck();
    }

    private _processFormValidation() {
        this.isProcessingRegistration$.next(true);

        if (this.registerFg.invalid) {
            const registerFormControls = this.registerFgControls;

            if (this.showUsername) {
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

            if (this.showUsername) {
                this.registerData = {
                    ...this.registerData,
                    userName: this.account.useEmailAsUsername ? this.account.email : this.registerFgControls.userName.value,
                };
            } else {
                if (this.account.email) {
                    this.registerData = { ...this.registerData, userName: this.account.email };
                }
            }

            this._registerWorkflowService
                .build({ registrationData: this.registerData })
                .pipe(take(1))
                .subscribe({
                    next: ({ status }) => {
                        if (status === 'SUCCESS') {
                            this.credentialsCreated.emit(this.registerData.userName);
                            this.registrationCompleted = true;
                            this._changeDetectorRef.markForCheck();
                        }
                        this.resetLoader();
                    },
                    error: () => {
                        this.resetLoader();
                    },
                    complete: () => {
                        this.resetLoader();
                    },
                });
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
        if (this.showUsername && !userNameControl) {
            const usernameConfig = new FormControl(this.account.useEmailAsUsername ? (this.account?.maskedEmail ? this.account.maskedEmail : this.account.email) : null, {
                validators: getSxmValidator('registrationUserName'),
                asyncValidators: [getValidateUserNameByServerFn(this._dataValidationSrv, this.account.useEmailAsUsername, 0, this._changeDetectorRef)],
                updateOn: 'blur',
            });
            this.registerFg.addControl('userName', usernameConfig);
        } else if (!this.showUsername && userNameControl) {
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

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
