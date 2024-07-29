import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { behaviorEventErrorsFromUserInteraction, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import {
    ActivateFreeListenByEmailWorkflowErrors,
    FindAccountByEmailForFreeListenWorkflowErrors,
    FindAccountByEmailForFreeListenWorkflowService,
    getFreeListenSetupViewModel,
    ActivateFreeListenByEmailWorkflowService,
} from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { getSxmValidator } from '@de-care/shared/validation';
import { SxmUiStepperComponent } from '@de-care/shared/sxm-ui/ui-stepper';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { OpenNativeAppService } from '@de-care/domains/utility/state-native-app-integration';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { Router, ActivatedRoute } from '@angular/router';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'de-care-free-listen-setup-page',
    templateUrl: './free-listen-setup-page.component.html',
    styleUrls: ['./free-listen-setup-page.component.scss'],
})
export class FreeListenSetupPageComponent implements AfterViewInit {
    private readonly _window: Window;
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.FreeListenSetupPageComponent.';
    form: FormGroup;
    processingEmailLookup$ = new BehaviorSubject(false);
    processingActivation$ = new BehaviorSubject(false);
    showInvalidEmailerror$ = new BehaviorSubject(false);
    showInvalidZiperror$ = new BehaviorSubject(false);
    showInvalidPhoneerror$ = new BehaviorSubject(false);
    showInvalidUsernameerror$ = new BehaviorSubject(false);
    showSystemerror$ = new BehaviorSubject(false);
    @ViewChild('ineligibleModal') private _ineligibleModal: SxmUiModalComponent;
    @ViewChild('existingAccountModal') private _existingAccountModal: SxmUiModalComponent;
    @ViewChild('stepper') private _stepper: SxmUiStepperComponent;
    viewModel$ = this._store.select(getFreeListenSetupViewModel);
    isCanadaMode$ = this._store.select(getIsCanadaMode);
    existingAccountModalAriaDescribedbyTextId = uuid();
    ineligibleModalAriaDescribedbyTextId = uuid();

    constructor(
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _findAccountByEmailForFreeListenWorkflowService: FindAccountByEmailForFreeListenWorkflowService,
        public _translateService: TranslateService,
        @Inject(DOCUMENT) document: Document,
        private readonly _openNativeAppService: OpenNativeAppService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _activateFreeListenByEmailWorkflowService: ActivateFreeListenByEmailWorkflowService
    ) {
        this.form = this._formBuilder.group({
            email: [
                null,
                {
                    validators: getSxmValidator('registrationUserName'),
                    updateOn: 'blur',
                },
            ],
        });
        this._window = document?.defaultView;
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
    }

    onSubmit() {
        this.form.markAllAsTouched();
        this.processingEmailLookup$.next(true);
        if (this.form.valid) {
            this._findAccountByEmailForFreeListenWorkflowService.build(this.form.value.email).subscribe({
                next: (data) => {
                    if (data) {
                        this._router.navigate(['./free-listen-confirmation'], { relativeTo: this._activatedRoute }).then(() => {
                            this.processingActivation$.next(false);
                        });
                    } else {
                        this._stepper.next();
                        this.processingEmailLookup$.next(false);
                        return;
                    }
                },
                error: (error: FindAccountByEmailForFreeListenWorkflowErrors) => {
                    if (error === 'INELIGIBLE') {
                        this._ineligibleModal.open();
                    } else if (error === 'EXISTING_ACCOUNT') {
                        this._existingAccountModal.open();
                    } else if (error === 'INVALID_EMAIL') {
                        this.showInvalidEmailerror$.next(true);
                    } else if (error === 'INVALID_PHONE_NUMBER') {
                        this.showInvalidPhoneerror$.next(true);
                    } else if (error === 'INVALID_USERNAME_OR_PASSWORD') {
                        this.showInvalidUsernameerror$.next(true);
                    } else if (error === 'INVALID_ZIP_CODE') {
                        this.showInvalidZiperror$.next(true);
                    } else if (error === 'SYSTEM') {
                        this.showSystemerror$.next(true);
                    }
                    this.processingEmailLookup$.next(false);
                },
            });
        } else {
            const errors = [];
            if (this.form.controls.email.errors) {
                // TODO: add behavior event error message string value here
                errors.push('');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: [''] }));
            this.processingEmailLookup$.next(false);
        }
    }

    onSignInClick() {
        const link = this._translateService.instant('DeCareUseCasesStreamingFeatureSetupCredentialsModule.Shared.PLAYER_LINK');
        if (link) {
            this._window.open(link, '_self');
        } else {
            this._openNativeAppService.openSxmPlayerApp();
        }
    }

    onActivate() {
        this.processingActivation$.next(true);
        this._activateFreeListenByEmailWorkflowService.build(this.form.value.email).subscribe({
            next: () => {
                this._router.navigate(['./free-listen-confirmation'], { relativeTo: this._activatedRoute }).then(() => {
                    this.processingActivation$.next(false);
                });
            },
            error: (error: ActivateFreeListenByEmailWorkflowErrors) => {
                if (error === 'INELIGIBLE') {
                    this._stepper.previous();
                    this._ineligibleModal.open();
                } else if (error === 'EXISTING_ACCOUNT') {
                    this._stepper.previous();
                    this._existingAccountModal.open();
                } else if (error === 'INVALID_EMAIL') {
                    this._stepper.previous();
                    this.showInvalidEmailerror$.next(true);
                } else if (error === 'INVALID_PHONE_NUMBER') {
                    this._stepper.previous();
                    this.showInvalidPhoneerror$.next(true);
                } else if (error === 'INVALID_USERNAME_OR_PASSWORD') {
                    this._stepper.previous();
                    this.showInvalidUsernameerror$.next(true);
                } else if (error === 'INVALID_ZIP_CODE') {
                    this._stepper.previous();
                    this.showInvalidZiperror$.next(true);
                } else if (error === 'SYSTEM') {
                    this._stepper.previous();
                    this.showSystemerror$.next(true);
                }
                this.processingActivation$.next(false);
            },
        });
    }
    getSiriusXM(url) {
        const translateUrl = this._translateService.instant(url);
        this._window.location.href = translateUrl;
    }
    recoverCred(recoverUrl) {
        const translateUrl = this._translateService.instant(recoverUrl);
        this._window.location.href = translateUrl;
    }
}
