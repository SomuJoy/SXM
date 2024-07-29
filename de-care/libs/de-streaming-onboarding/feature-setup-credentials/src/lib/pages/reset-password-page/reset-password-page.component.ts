import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { getSxmValidator, SxmValidators } from '@de-care/shared/forms-validation';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
    AccountCredentialRecoveryFromUpdatePasswordLookupWorkflowService,
    getResetPasswordAccountType,
    getResetToken,
    getResetPasswordUsername,
    getSrcQueryParam,
    processInboundQueryParams,
} from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { ActivatedRoute, Router } from '@angular/router';
import { getValidatePasswordServerFn } from '@de-care/shared/validation';
import { DataValidationService } from '@de-care/data-services';
import { SxmUiPasswordStrengthComponent } from '@de-care/shared/sxm-ui/ui-password-form-field';
import {
    behaviorEventErrorFromBusinessLogic,
    behaviorEventErrorFromSystem,
    behaviorEventErrorsFromUserInteraction,
    behaviorEventImpressionForComponent,
    behaviorEventReactionFeatureTransactionStarted,
} from '@de-care/shared/state-behavior-events';
import * as uuid from 'uuid/v4';
import { take } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-streaming-onboarding-reset-password-page',
    templateUrl: './reset-password-page.component.html',
    styleUrls: ['./reset-password-page.component.scss'],
})
export class ResetPasswordPageComponent implements OnInit, AfterViewInit, ComponentWithLocale, OnDestroy {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    passwordForm: FormGroup;
    subTitle$: any;
    submitted = false;
    processing$ = new BehaviorSubject(false);
    resetTok: any;
    resetTokAccountType: any;
    userName: any;
    showBusinessError$ = new BehaviorSubject(false);
    reservedWords: string[] = [];
    readonly passwordElementId = uuid();
    @ViewChild('passwordControl') private _passwordFormField: SxmUiPasswordStrengthComponent;
    alwaysDisplayPasswordHint = false;
    private _translateSubscription: Subscription;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _formBuilder: FormBuilder,
        private _sxmValidators: SxmValidators,
        private _store: Store,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _accountCredentialRecoveryFromUpdatePasswordLookupWorkflowService: AccountCredentialRecoveryFromUpdatePasswordLookupWorkflowService,
        private _dataValidationService: DataValidationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _titleService: Title
    ) {
        translationsForComponentService.init(this);
        this._translateSubscription = this.translationsForComponentService.stream(`${this.translateKeyPrefix}.FORGOT_PASSWORD_PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
        this._store
            .select(getSrcQueryParam)
            .pipe(take(1))
            .subscribe((queryParams) => {
                if (queryParams === 'oac' || queryParams === 'sclogin') {
                    this._store.dispatch(processInboundQueryParams());
                }
                if (queryParams === 'player' || 'everestplayer') {
                    this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery', flowVariation: 'iap' }));
                }
                if (queryParams === 'alexa') {
                    this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery', flowVariation: 'iapalexa' }));
                }
                if (queryParams === 'google') {
                    this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery', flowVariation: 'iapgoogle' }));
                } else {
                    this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery', flowVariation: queryParams }));
                }
            });
    }

    ngOnInit() {
        this.passwordForm = this._formBuilder.group({
            password: [
                null,
                {
                    validators: getSxmValidator('password'),
                    asyncValidators: getValidatePasswordServerFn(this._dataValidationService, () => this._changeDetectorRef.markForCheck()),
                },
            ],
        });
        this._store.select(getResetToken).subscribe((data) => {
            this.resetTok = data;
        });
        this._store.select(getResetPasswordAccountType).subscribe((data) => {
            this.resetTokAccountType = data;
        });
        this._store.select(getResetPasswordUsername).subscribe((data) => {
            this.userName = data;
        });
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'resetpassword' }));
    }

    onSubmit() {
        this.passwordForm.markAllAsTouched();
        this.submitted = true;
        this.processing$.next(true);
        this.showBusinessError$.next(false);
        if (this.passwordForm.valid) {
            const param = {
                password: this.passwordForm.value.password,
                resetKey: this.resetTok,
                accountLoginCredentials: this.resetTokAccountType === 'oac' ? true : false,
            };
            this._accountCredentialRecoveryFromUpdatePasswordLookupWorkflowService.build(param).subscribe({
                next: () => {
                    this._router.navigate(['../update-password-confirmation'], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' }).then(() => {
                        this.processing$.next(false);
                    });
                },
                error: (error) => {
                    if (error?.error?.error?.errorType === 'BUSINESS') {
                        this._store.dispatch(
                            behaviorEventErrorFromBusinessLogic({
                                message: 'Your password reset request has expired. Please submit another request.',
                                errorCode: 'INVALID_PASSWORD_RESET_TOKEN',
                            })
                        );
                        this.showBusinessError$.next(true);
                    } else {
                        this._store.dispatch(
                            behaviorEventErrorFromSystem({
                                message: 'We’re sorry… something went wrong. We’re experiencing technical issues and are working on resolving it. Please try again.',
                            })
                        );
                    }
                    this.processing$.next(false);
                },
            });
        } else {
            const errors = [];
            const passwordControl = this.passwordForm.controls.password;
            // TODO: check with Launch team to see if we can change these to not have Registration text in them (use something like Streaming Credentials)
            if (passwordControl.hasError('required')) {
                errors.push('Reset Pwd  - Missing password');
            } else {
                errors.push('Reset Pwd - Invalid password - does not meet criteria');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: [''] }));
            this.processing$.next(false);
        }
        this._store.dispatch(behaviorEventErrorFromBusinessLogic({ message: 'USER_NOT_FOUND_IN_IDM' }));
    }

    mouseEnterOnContinueButton() {
        if (this._passwordFormField && this._passwordFormField.displayPasswordHint) {
            this.alwaysDisplayPasswordHint = true;
        }
    }

    mouseLeaveOnContinueButton() {
        this.alwaysDisplayPasswordHint = false;
    }

    ngOnDestroy(): void {
        this._translateSubscription.unsubscribe();
    }
}
