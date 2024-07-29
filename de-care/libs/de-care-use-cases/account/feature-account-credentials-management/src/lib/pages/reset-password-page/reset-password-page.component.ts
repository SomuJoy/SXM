import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { getSxmValidator } from '@de-care/shared/forms-validation';
import { Store } from '@ngrx/store';
import {
    AccountCredentialRecoveryFromUpdatePasswordLookupWorkflowService,
    getResetPasswordAccountType,
    getResetToken,
    getResetPasswordUsername,
    getSrcQueryParam,
    processInboundQueryParams,
} from '@de-care/de-care-use-cases/account/state-account-credentials-management';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
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
    selector: 'de-care-reset-password-page',
    templateUrl: './reset-password-page.component.html',
    styleUrls: ['./reset-password-page.component.scss'],
})
export class ResetPasswordPageComponent implements OnInit, ComponentWithLocale, AfterViewInit, OnDestroy {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    passwordForm: FormGroup;
    subTitle$: any;
    submitted = false;
    processing$ = new BehaviorSubject(false);
    resetTok: any;
    resetTokAccountType: any;
    userName: any;
    showSystemError$ = new BehaviorSubject(false);
    showBusinessError$ = new BehaviorSubject(false);
    reservedWords: string[] = [];
    readonly passwordElementId = uuid();
    @ViewChild('passwordControl') private _passwordFormField: SxmUiPasswordStrengthComponent;
    alwaysDisplayPasswordHint = false;
    private _translateSubscription: Subscription;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _formBuilder: FormBuilder,
        private _store: Store,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _accountCredentialRecoveryFromUpdatePasswordLookupWorkflowService: AccountCredentialRecoveryFromUpdatePasswordLookupWorkflowService,
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
                if (queryParams) {
                    if (queryParams === 'everestplayer' || queryParams === 'player') {
                        this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery', flowVariation: 'streaming' }));
                    } else {
                        this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery', flowVariation: queryParams }));
                    }
                } else {
                    this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery' }));
                }
            });
    }
    ngOnDestroy(): void {
        this._translateSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'resetpassword' }));
    }

    ngOnInit() {
        this.passwordForm = this._formBuilder.group({
            password: [
                null,
                {
                    validators: getSxmValidator('password'),
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

    onSubmit() {
        this.passwordForm.markAllAsTouched();
        this.submitted = true;
        this.processing$.next(true);
        this.showBusinessError$.next(false);
        this.showSystemError$.next(false);
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
                    } else if (error?.error?.error?.fieldErrors && error?.error?.error?.fieldErrors[0]?.errorCode === 'INVALID_PASSWORD') {
                        this.passwordForm.get('password').setErrors({ generic: true });
                    } else if (error?.error?.error?.fieldErrors && error?.error?.error?.fieldErrors[0]?.errorCode === 'PASSWORD_HAS_PII_DATA') {
                        this.passwordForm.get('password').setErrors({ piiData: true });
                    } else {
                        this.showSystemError$.next(true);
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
            if (passwordControl.hasError('required')) {
                errors.push('Reset Pwd - Missing password');
            } else {
                errors.push('Reset Pwd - Invalid password - does not meet criteria');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this.processing$.next(false);
        }
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
