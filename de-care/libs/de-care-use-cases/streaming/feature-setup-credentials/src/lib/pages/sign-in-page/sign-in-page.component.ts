import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SignInAndActivateDeviceWorkflowService } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { ComponentLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-sign-in-page',
    templateUrl: './sign-in-page.component.html',
    styleUrls: ['./sign-in-page.component.scss'],
})
export class SignInPageComponent implements OnInit, OnDestroy {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    private _translateSubscription: Subscription;
    translateKeyPrefixShared = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.Shared.';

    signInForm: FormGroup;
    signInFormError$ = new BehaviorSubject(false);
    signInFormProcessing$ = new BehaviorSubject(false);
    signInFormErrorType$ = new BehaviorSubject<null | 'SYSTEM' | 'INVALID_ACTIVATION_CODE' | 'INVALID_CREDENTIALS'>(null);
    signInFormErrorMessage$ = this.signInFormErrorType$.pipe(
        map((errorType) => {
            switch (errorType) {
                case 'INVALID_CREDENTIALS':
                    return 'FORM_ERROR_INVALID_CREDENTIALS';
                case 'SYSTEM':
                default:
                    return 'FORM_ERROR_SYSTEM';
            }
        }),
        concatMap((translateKey) => this._translateService.stream(`${this.translateKeyPrefix}.${translateKey}`))
    );

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _translateService: TranslateService,
        private readonly _formBuilder: FormBuilder,
        private readonly _signInAndActivateDeviceWorkflowService: SignInAndActivateDeviceWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private _titleService: Title
    ) {
        translationsForComponentService.init(this);
        this._translateSubscription = this._translateService.stream(`${this.translateKeyPrefixShared}APP_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
    }

    ngOnInit(): void {
        this.signInForm = this._formBuilder.group({
            username: ['', [Validators.required]], // TODO: add username/email pattern validation
            password: ['', [Validators.required]],
        });
    }

    ngOnDestroy() {
        this._translateSubscription?.unsubscribe();
    }

    ngAfterViewInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
    }

    resetToActivationCodeStep() {
        this.signInFormError$.next(false);
        this.signInFormErrorType$.next(null);
        this.signInForm.reset();
        this._router.navigate(['onboarding/activate-device']);
    }

    onSignInSubmit() {
        this.signInFormProcessing$.next(true);
        this.signInFormError$.next(false);
        this.signInFormErrorType$.next(null);
        this.signInForm.markAllAsTouched();
        if (this.signInForm.valid) {
            this._signInAndActivateDeviceWorkflowService.build(this.signInForm.value).subscribe({
                next: () => {
                    this._router.navigate(['./activated'], { relativeTo: this._activatedRoute }).then(() => {
                        this.signInFormProcessing$.next(false);
                    });
                },
                error: (error) => {
                    this.signInFormErrorType$.next(error);
                    this.signInFormError$.next(true);
                    this.signInFormProcessing$.next(false);
                },
                complete: () => {
                    this.signInFormProcessing$.next(false);
                },
            });
        } else {
            const errors = [];
            if (this.signInForm.get('username').errors) {
                errors.push('Registration - Missing username');
            }
            if (this.signInForm.get('password').errors) {
                errors.push('Registration - Missing password');
            }
            this.signInFormProcessing$.next(false);
        }
    }

    navigateToCredentials() {
        this._router.navigate(['account/credentials'], { queryParams: { thirdPartyLinkingVendorId: 'sonos', src: 'onboarding' }, queryParamsHandling: 'merge' });
    }
}
