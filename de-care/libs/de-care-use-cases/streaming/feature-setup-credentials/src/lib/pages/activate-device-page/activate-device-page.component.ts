import { Component, ViewChild, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent, behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { SxmUiStepperComponent } from '@de-care/shared/sxm-ui/ui-stepper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { map, concatMap } from 'rxjs/operators';
import {
    ValidateAndCollectDeviceActivationCodeWorkflowService,
    SignInAndActivateDeviceWorkflowService,
    getDeviceActivationIsForTrial,
    setIsSonosFlow,
    getIsSonosFlow,
} from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'de-care-activate-device',
    templateUrl: './activate-device-page.component.html',
    styleUrls: ['./activate-device-page.component.scss'],
})
export class ActivateDevicePageComponent implements OnInit {
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.ActivateDevicePageComponent.';
    invalidActivationCodeTranslateKeyPrefix = `${this.translateKeyPrefix}STEPS.SIGN_IN.FORM_ERROR_INVALID_ACTIVATION_CODE_PIECES.`;
    @ViewChild('stepper') private readonly _stepper: SxmUiStepperComponent;

    activationCodeForm: FormGroup;
    activationCodeFormError$ = new BehaviorSubject(false);
    activationCodeFormProcessing$ = new BehaviorSubject(false);
    activationCodeFormErrorType$ = new BehaviorSubject<null | 'SYSTEM' | 'INVALID_ACTIVATION_CODE'>(null);
    activationCodeFormErrorMessage$ = this.activationCodeFormErrorType$.pipe(
        map((errorType) => (errorType === 'INVALID_ACTIVATION_CODE' ? 'FORM_ERROR_INVALID_ACTIVATION_CODE' : 'FORM_ERROR_SYSTEM')),
        concatMap((translateKey) => this._translateService.stream(`${this.translateKeyPrefix}STEPS.ACTIVATION_CODE.${translateKey}`))
    );

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
        concatMap((translateKey) => this._translateService.stream(`${this.translateKeyPrefix}STEPS.SIGN_IN.${translateKey}`))
    );
    activationIsForTrial$ = this._store.select(getDeviceActivationIsForTrial);
    isSonosFlow$ = this._store.select(getIsSonosFlow);

    constructor(
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _translateService: TranslateService,
        private readonly _validateAndCollectDeviceActivationCodeWorkflowService: ValidateAndCollectDeviceActivationCodeWorkflowService,
        private readonly _signInAndActivateDeviceWorkflowService: SignInAndActivateDeviceWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.activationCodeForm = this._formBuilder.group({
            activationCode: ['', [Validators.required, Validators.pattern(/^[a-z0-9]+$/i)]],
        });

        this.signInForm = this._formBuilder.group({
            username: ['', [Validators.required]], // TODO: add username/email pattern validation
            password: ['', [Validators.required]],
        });
    }

    activationCodeStepActive = () => {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'enteractivationcode' }));
    };

    signInStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'registerdevice' }));
    }

    onActivationCodeSubmit() {
        this.activationCodeFormProcessing$.next(true);
        this.activationCodeFormError$.next(false);
        this.activationCodeFormErrorType$.next(null);
        this.activationCodeForm.markAllAsTouched();
        if (this.activationCodeForm.valid) {
            this._validateAndCollectDeviceActivationCodeWorkflowService.build(this.activationCodeForm.value.activationCode).subscribe({
                next: () => {
                    this._stepper.next();
                    this.activationCodeFormProcessing$.next(false);
                },
                error: (error) => {
                    this.activationCodeFormErrorType$.next(error);
                    this.activationCodeFormError$.next(true);
                    this.activationCodeFormProcessing$.next(false);
                },
                complete: () => {
                    this.activationCodeFormProcessing$.next(false);
                },
            });
        } else {
            this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: ['Auth - Missing or invalid activation code'] }));
            this.activationCodeFormProcessing$.next(false);
        }
    }

    onSignInSubmit() {
        this.signInFormProcessing$.next(true);
        this.signInFormError$.next(false);
        this.signInFormErrorType$.next(null);
        this.signInForm.markAllAsTouched();
        if (this.signInForm.valid) {
            this._signInAndActivateDeviceWorkflowService.build(this.signInForm.value).subscribe({
                next: () => {
                    this._store.dispatch(setIsSonosFlow({ isSonosFlow: false }));
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
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this.signInFormProcessing$.next(false);
        }
    }

    resetToActivationCodeStep() {
        this.signInFormError$.next(false);
        this.signInFormErrorType$.next(null);
        this.signInForm.reset();
        this.activationCodeForm.reset();
        this._stepper.previous();
    }

    navigateToCredentials() {
        this._router.navigate(['account/credentials'], { queryParams: { thirdPartyLinkingVendorId: 'sonos', src: 'onboarding' }, queryParamsHandling: 'merge' });
    }
}
