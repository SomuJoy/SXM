import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { getSxmValidator } from '@de-care/shared/validation';
import * as uuid from 'uuid/v4';
import { NuDetectConfigService } from '@de-care/shared/security';
import { SxmUiNucaptchaComponent } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { Store } from '@ngrx/store';
import {
    behaviorEventReactionLookupByLoginFailure,
    behaviorEventErrorsFromUserInteraction,
    behaviorEventReactionAuthenticationByLoginSuccess,
} from '@de-care/shared/state-behavior-events';
import { AuthenticateRequest, AuthenticationWorkflowService } from '@de-care/domains/account/state-login';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { DOCUMENT } from '@angular/common';
import { SMART_LINK_URLS, SmartLinkUrls } from '@de-care/shared/configuration-tokens-smart-link';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements ComponentWithLocale, OnInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @ViewChild('ndsPmdEl', { static: true }) ndsPmd: ElementRef;

    @Output() fetchedAccountNumber = new EventEmitter<string>();
    @Output() partnerLoginRequired = new EventEmitter<{ partnerName: string; partnerType: string }>();
    @Output() loginError = new EventEmitter();
    @Input() submitButtonTextOverride: string;
    @Input() prefillUsernameValue: string;
    @Input() isLoading;
    @Input() hasKeepSignedInOption = true;
    @Input() userBehaviorPayload: string;
    @ViewChild('nuCaptcha', { static: false })
    private _nucaptchaComponent: SxmUiNucaptchaComponent;

    @Input() set failedToLoadAccount(value: boolean) {
        if (value) {
            this.isLoading = false;
            this.isGenericError = true;
            this._changeDetectorRef.markForCheck();
        }
    }

    signInForm: FormGroup;
    userNotFound = false;
    accountNotSupportedError = false;
    usernameId = uuid();
    passwordId = uuid();
    checkboxId = uuid();
    needCaptcha = false; // TODO: will be from nudetect saying we need to use captcha to verify
    hasCaptcha = false; // comes from nucaptcha component indicating a captcha has been successfully received from the server
    captchaAnswerWrong = false;
    captchaSubmitted = false;
    isGenericError = false;
    isSxirAccNotSupported = false;
    isProspectAccNotSupported = false;
    isMaxInvalidAttemptReached = false;
    playerUrl: string;

    get frmControls(): {
        [key: string]: AbstractControl;
    } {
        return this.signInForm.controls;
    }

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private _fb: FormBuilder,
        private _nuDetectConfigSrv: NuDetectConfigService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _store: Store,
        private _authenticationWorkflowService: AuthenticationWorkflowService,
        @Inject(DOCUMENT) readonly document: Document,
        @Inject(SMART_LINK_URLS) private readonly _smartLinkUrls: SmartLinkUrls
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit() {
        this.genForm();
        this._nuDetectConfigSrv.initializeNuDetectConfig('Login');
        this.playerUrl = `${this._smartLinkUrls.toPlayer}?ALC=0`;
    }

    private genForm() {
        this.signInForm = this._fb.group({
            username: [this.prefillUsernameValue || null, getSxmValidator('userName')],
            password: [null, getSxmValidator('password')],
            keep: [false],
            nucaptcha: [null],
        });
    }

    send() {
        this.accountNotSupportedError = false;
        // TODO: this is a temporary method to grab an external input element with the nds value, will be handled in the future with an injected service
        const ndsElementRef: HTMLInputElement = this.document.querySelector('input[name="nds-pmd"]:not([data-location="internal"])');
        if (this.signInForm.valid) {
            this.isLoading = true;
            if (this.needCaptcha) {
                // resetting captcha values
                this.captchaAnswerWrong = false;
                this.captchaSubmitted = true;
            }
            const formValue = this.signInForm.value;
            const loginInfo: AuthenticateRequest = {
                token: {
                    username: formValue.username,
                    password: formValue.password,
                },
                environmentData: {
                    userBehaviorPayload: ndsElementRef?.value ?? this.ndsPmd.nativeElement.value,
                },
                ...(this.needCaptcha && { captchaAnswer: this.signInForm.value.nucaptcha.answer }),
                ...(this.needCaptcha && { captchaToken: this._nucaptchaComponent.getCaptchaToken() }),
                ...(this.hasKeepSignedInOption && { keepMeSignedIn: formValue.keep }),
            };
            this.userNotFound = false;
            this.isGenericError = false;
            this.isSxirAccNotSupported = false;
            this.isProspectAccNotSupported = false;
            this.isMaxInvalidAttemptReached = false;
            this._authenticationWorkflowService.build(loginInfo).subscribe(
                (response) => {
                    if (response?.thirdPartyPartnerName) {
                        this.partnerLoginRequired.emit({ partnerName: response.thirdPartyPartnerName, partnerType: response.thirdPartyPartnerType });
                        return;
                    }
                    this._store.dispatch(behaviorEventReactionAuthenticationByLoginSuccess());
                    this.needCaptcha = false;
                    return this.fetchedAccountNumber.emit(response?.accountNum);
                    // note: component listening for fetchedAccountNumber will set isLoading to false
                },
                (error) => {
                    if (error?.errorCode === 'INVALID_USERNAME_OR_PASSWORD') {
                        this.userNotFound = true;
                        this._changeDetectorRef.markForCheck();
                        this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: ['Auth - Incorrect username and/or password'] }));
                        this._store.dispatch(behaviorEventReactionLookupByLoginFailure());
                        this.isLoading = false;
                    } else if (error?.errorCode === 'CAPTCHA_REQUIRED') {
                        if (this.needCaptcha) {
                            // if captcha is required but has already been set up and the correct captcha answer was sent with the request,
                            // then if the error response is CAPTCHA_REQUIRED then that means the username/password is incorrect
                            this.userNotFound = true;
                            this.captchaSubmitted = false; //so the captcha component doesn't mark the field with an error
                            this._nucaptchaComponent.getNewCaptcha();
                        } else {
                            // will now need require captcha on subsequent login attempts
                            this.needCaptcha = true;
                        }
                        this._changeDetectorRef.markForCheck();
                        this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: ['Auth - Incorrect username and/or password'] }));
                        this._store.dispatch(behaviorEventReactionLookupByLoginFailure());
                    } else if (error?.fieldErrors && error?.fieldErrors?.length > 0) {
                        // potential captcha errors
                        if (
                            error.fieldErrors[0].errorCode === 'CAPTCHA_ANSWER_INCORRECT' ||
                            error.fieldErrors[0].errorCode === 'CAPTCHA_ANSWER_MISSING' ||
                            error.fieldErrors[0].errorCode === 'CAPTCHA_TOKEN_MISSING'
                        ) {
                            this.captchaAnswerWrong = true;
                            this.captchaSubmitted = false;
                            this._changeDetectorRef.markForCheck();
                            this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: ['General - Missing or invalid nucaptcha'] }));
                            this._store.dispatch(behaviorEventReactionLookupByLoginFailure());
                        } else {
                            this.isGenericError = true;
                        }
                    } else if (error?.errorCode === 'CUSTOMER_TYPE_NOT_SUPPORTED') {
                        this.accountNotSupportedError = true;
                        this.isLoading = false;
                        this._changeDetectorRef.markForCheck();
                        this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: ['Auth - Account type not supported'] }));
                        this._store.dispatch(behaviorEventReactionLookupByLoginFailure());
                    } else if (error?.errorCode === 'SXIR_ACCOUNT_TYPE_NOT_SUPPORTED') {
                        this.isSxirAccNotSupported = true;
                        this.isLoading = false;
                        this._changeDetectorRef.markForCheck();
                    } else if (error?.errorCode === 'PROSPECT_ACCOUNT_TYPE_NOT_SUPPORTED') {
                        this.isProspectAccNotSupported = true;
                        this.isLoading = false;
                        this._changeDetectorRef.markForCheck();
                    } else if (error?.errorCode === 'UNKNOWN_ACCOUNT_TYPE_NOT_SUPPORTED') {
                        this.isLoading = false;
                        this.loginError.emit();
                        this._changeDetectorRef.markForCheck();
                    } else if (error?.errorCode === 'MAX_INVALID_ATTEMPT_REACHED' || error?.errorCode === 'ACCOUNT_LOCKED') {
                        this.isMaxInvalidAttemptReached = true;
                        this.isLoading = false;
                        this._changeDetectorRef.markForCheck();
                    } else {
                        this.isGenericError = true;
                    }

                    if (this.isGenericError) {
                        this.isLoading = false;
                        this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: ['Auth - Unable to authenticate'] }));
                        this._store.dispatch(behaviorEventReactionLookupByLoginFailure());
                        this.loginError.emit();
                        this._changeDetectorRef.markForCheck();
                    }
                }
            );
        } else {
            this.isLoading = false;
            if (this.frmControls.username.errors) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: ['Auth - Missing username'] }));
            }

            if (this.frmControls.password.errors) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: ['Auth - Missing password'] }));
            }

            if (this.frmControls.nucaptcha.errors) {
                this.captchaSubmitted = true;
            }
        }
    }

    gotCaptcha(val): void {
        this.hasCaptcha = val;
        this.hasCaptcha ? this.signInForm.controls.nucaptcha.setValidators(Validators.required) : this.signInForm.controls.nucaptcha.setValidators(null);
        this.signInForm.controls.nucaptcha.reset();
    }

    captchaRendered(): void {
        this.isLoading = false;
    }
}
