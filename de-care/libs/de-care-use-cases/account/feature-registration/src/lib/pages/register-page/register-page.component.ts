import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SxmLanguages } from '@de-care/app-common';
import {
    CredentialsNeededType,
    getRegistrationDataNeeded,
    registerAccount,
    getFirstName,
    getEmailForUserName,
    setEmailOnAccountFromConfirmation,
    setUserBehaviorPayload,
    selectIsInStepUpFlow,
    getRegistrationSubmissionErrorStatus,
} from '@de-care/de-care-use-cases/account/state-registration';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { getSecurityQuestions, SecurityQuestionsAnswersModel } from '@de-care/domains/account/state-security-questions';
import { getLanguage } from '@de-care/domains/customer/state-locale';
import { getCountry } from '@de-care/shared/state-settings';
import { SxmUiStepperComponent } from '@de-care/shared/sxm-ui/ui-stepper';
import { getSxmValidator } from '@de-care/shared/validation';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Subject, Subscription } from 'rxjs';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { behaviorEventErrorsFromUserInteraction, behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { NuDetectConfigService } from '@de-care/shared/security';
import { DotProgressBarStepperComponent } from '@de-care/shared/sxm-ui/ui-dot-progress-bar-stepper';

export interface RegistrationDataStillNeeded {
    emailPreFill: string;
    phonePreFill: string;
    email: boolean;
    phoneNumber: boolean;
    securityQuestions: boolean;
    loginCredentials: CredentialsNeededType;
}

export interface SecurityQuestionsFormValue {
    question1: number;
    question2: number;
    question3: number;
    answer1: string;
    answer2: string;
    answer3: string;
}

@Component({
    selector: 'de-care-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit, OnDestroy {
    @ViewChild('ndsPmdEl') ndsPmd: ElementRef;

    translateKeyPrefix = 'deCareUseCasesAccountFeatureRegistration.registerPageComponent';
    @ViewChild('subStepper') subStepper: SxmUiStepperComponent;
    @ViewChild(DotProgressBarStepperComponent) dotProgressStepper: DotProgressBarStepperComponent;
    form: FormGroup;
    emailFormGroup: FormGroup;
    phoneNumberFormGroup: FormGroup;
    securityQuestionsFormGroup: FormGroup;
    loginCredentialsFormGroup: FormGroup;
    formReady = false;
    staticStepData = { step: 2, subStep: 1 };
    staticStepDataInStepUp = { step: 2, subStep: 1 };

    registrationDataNeeded$ = this._store.pipe(select(getRegistrationDataNeeded));
    securityQuestions$ = this._store.pipe(select(getSecurityQuestions));
    language$ = this._store.pipe(select(getLanguage));
    country$ = this._store.pipe(select(getCountry));
    firstName$ = this._store.pipe(select(getFirstName));
    emailOnAccountOrFlepzForUserName$ = this._store.select(getEmailForUserName);
    isInStepUpFlow$ = this._store.pipe(select(selectIsInStepUpFlow));
    private readonly _unsubscribe$: Subject<void> = new Subject();
    registrationSubmissionErrorStatus$ = this._store.select(getRegistrationSubmissionErrorStatus);
    systemError$ = new BehaviorSubject(false);
    private _emailControlStatusSubscription: Subscription;

    constructor(private readonly _formBuilder: FormBuilder, private readonly _store: Store, private readonly _nuDetectConfigSrv: NuDetectConfigService) {}

    ngOnInit(): void {
        this._listenForRegistrationData();

        this.registrationSubmissionErrorStatus$
            .pipe(
                takeUntil(this._unsubscribe$),
                tap((status) => {
                    if (this.loginCredentialsFormGroup && this.loginCredentialsFormGroup.controls['email'] && status.userNameError) {
                        this.loginCredentialsFormGroup.controls['email'].setErrors({ usernameInUse: true });
                    } else if (this.loginCredentialsFormGroup && this.loginCredentialsFormGroup.controls['password'] && status.passwordInvalid) {
                        this.loginCredentialsFormGroup.controls['password'].setErrors({ generic: true });
                    } else if (this.loginCredentialsFormGroup && this.loginCredentialsFormGroup.controls['password'] && status.passwordContainsPiiData) {
                        this.loginCredentialsFormGroup.controls['password'].setErrors({ piiData: true });
                    } else if (status.systemError) {
                        this.systemError$.next(true);
                    }
                })
            )
            .subscribe();
    }

    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    onContinueRequested(formGroup: FormGroup) {
        formGroup?.markAllAsTouched();

        if (formGroup?.controls['email']) {
            this._store.dispatch(setEmailOnAccountFromConfirmation({ email: formGroup?.controls['email'].value }));
        }

        if (formGroup?.valid) {
            this.dotProgressStepper.next();
        }
    }

    onContinueSubstep() {
        this.subStepper.next();
    }

    onSubmit() {
        this.form.markAllAsTouched();
        const emailControl = this.form.get('loginCredentials')?.get('email');
        if (this.form.pending) {
            this._emailControlStatusSubscription?.unsubscribe();
            this._emailControlStatusSubscription = emailControl?.statusChanges.pipe(filter((status) => status === 'INVALID')).subscribe(() => {
                if (emailControl.hasError('usernameInUse')) {
                    this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: ['Auth - Username in use or is not allowed'] }));
                }
                this._emailControlStatusSubscription?.unsubscribe();
            });
        }
        if (this.form.valid) {
            this.systemError$.next(false);
            this._store.dispatch(setUserBehaviorPayload({ userBehaviorPayload: this.ndsPmd.nativeElement.value }));
            this._store.dispatch(
                registerAccount({
                    ...this.form.value,
                    securityQuestionsData: this._mapSecurityQuestionValues(this.form.controls.securityQuestionsData.value),
                })
            );
        } else {
            const errors = [];
            if (this.form.get('loginCredentials')?.get('email')?.errors) {
                errors.push('Auth - Missing or invalid email or username');
            }
            if (this.form.get('loginCredentials')?.get('password')?.errors) {
                errors.push('Auth - Missing or invalid password');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
        }
    }

    // formats values into proper request values
    private _mapSecurityQuestionValues(value: SecurityQuestionsFormValue): SecurityQuestionsAnswersModel[] {
        return [
            {
                id: value.question1,
                answer: value.answer1,
            },
            {
                id: value.question2,
                answer: value.answer2,
            },
            {
                id: value.question3,
                answer: value.answer3,
            },
        ];
    }

    private _listenForRegistrationData() {
        this.registrationDataNeeded$
            .pipe(
                filter((data) => !!data && data?.ready),
                take(1)
            )
            .subscribe(this._buildForm.bind(this));
    }

    private _buildForm(data: RegistrationDataStillNeeded) {
        this.form = this._formBuilder.group({});
        if (data.email) {
            this.staticStepData = { step: 1, subStep: 2 };
            this.emailFormGroup = this._formBuilder.group({ email: [data.emailPreFill] }, { updateOn: 'blur' });
            this.form.addControl('emailData', this.emailFormGroup);
            combineLatest([this.language$, this.country$])
                .pipe(takeUntil(this._unsubscribe$))
                .subscribe(([language, country]) => {
                    this.emailFormGroup.controls['email'].setValidators(getSxmValidator('registrationUserName', country, language as SxmLanguages));
                });
        }
        if (data.phoneNumber) {
            this.staticStepData = { step: 1, subStep: 2 };
            this.phoneNumberFormGroup = this._formBuilder.group({ phoneNumber: [data?.phonePreFill, [Validators.required]] }, { updateOn: 'blur' });
            this.form.addControl('phoneNumberData', this.phoneNumberFormGroup);
        }
        if (data.securityQuestions) {
            this.securityQuestionsFormGroup = this._formBuilder.group({});
            this.form.addControl('securityQuestionsData', this.securityQuestionsFormGroup);
        }
        if (data.loginCredentials) {
            this.loginCredentialsFormGroup = this._formBuilder.group({});
            this.form.addControl('loginCredentials', this.loginCredentialsFormGroup);
        }

        this.formReady = true;
        this._store.dispatch(pageDataFinishedLoading());
        this._nuDetectConfigSrv.initializeNuDetectConfig('Login');
    }

    trackComponent(componentKey: string) {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'registration', componentKey }));
    }
}
