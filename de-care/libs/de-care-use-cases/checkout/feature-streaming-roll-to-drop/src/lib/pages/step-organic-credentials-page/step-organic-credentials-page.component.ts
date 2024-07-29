import { CommonModule, Location } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    getOrganicCredentialsViewModel,
    getUserEnteredDataForOrganicCredentials,
    LoadAccountFromEmailLookupWorkflowService,
    LoadAccountFromEmailLookupWorkflowError,
    SetAccountInfoAndProcessAfterLpzVerificationWorkflowService,
    SetAccountInfoAndProcessAfterLpzVerificationWorkflowErrors,
    LoadAccountFromSubscriptionIdWorkflowService,
    LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService,
} from '@de-care/de-care-use-cases/checkout/state-streaming-roll-to-drop';
import { DomainsIdentificationUiValidateLpzFormModule, ValidateLpzFormComponentApi } from '@de-care/domains/identification/ui-validate-lpz-form';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { behaviorEventErrorsFromUserInteraction, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiEmailFormFieldModule } from '@de-care/shared/sxm-ui/ui-email-form-field';
import { SharedSxmUiUiModalModule, SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiPasswordFormFieldModule } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SxmUiSkeletonLoaderPanelComponentModule } from '@de-care/shared/sxm-ui/ui-skeleton-loader-panel';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, throwError, timer } from 'rxjs';
import { take, filter, catchError, tap } from 'rxjs/operators';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../page-step-route-configuration';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { SharedSxmUiUiLoadingWithAlertMessageModule } from '@de-care/shared/sxm-ui/ui-loading-with-alert-message';
import { ForceUpdateFormFieldOnEnterKeyDirective } from '@de-care/shared/sxm-ui/ui-form-directives';
import { ReactiveComponentModule } from '@ngrx/component';
import * as uuid from 'uuid/v4';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-step-organic-credentials-page',
    templateUrl: './step-organic-credentials-page.component.html',
    styleUrls: ['./step-organic-credentials-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ReactiveComponentModule,
        TranslateModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiEmailFormFieldModule,
        SharedSxmUiUiPasswordFormFieldModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiModalModule,
        DomainsIdentificationUiValidateLpzFormModule,
        SharedSxmUiUiDataClickTrackModule,
        SxmUiSkeletonLoaderPanelComponentModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        SharedSxmUiUiLoadingWithAlertMessageModule,
        ForceUpdateFormFieldOnEnterKeyDirective,
    ],
})
export class StepOrganicCredentialsPageComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    organicCredentialsViewModel$ = this._store.select(getOrganicCredentialsViewModel);
    accountLookupForm: FormGroup;
    accountLookupProcessing$ = new BehaviorSubject(false);
    accountLookupFormSystemError = false;
    displayIneligibleLoader$ = new BehaviorSubject(false);
    @ViewChild('subscriptionWithStreamingFoundModal') private readonly _subscriptionWithStreamingFoundModal: SxmUiModalComponent;
    @ViewChild('lpzModal') private readonly _lpzModal: SxmUiModalComponent;
    @ViewChild('lpzFormComponent') private _lpzFormComponent: ValidateLpzFormComponentApi;
    subscriptionFoundModalAriaDescribedbyTextId = uuid();
    lpzModalAriaDescribedbyTextId = uuid();

    private _passwordFormControl: AbstractControl;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _formBuilder: FormBuilder,
        private readonly _sxmValidators: SxmValidators,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _store: Store,
        private readonly _loadAccountFromEmailLookupWorkflowService: LoadAccountFromEmailLookupWorkflowService,
        private readonly _loadAccountFromSubscriptionIdWorkflowService: LoadAccountFromSubscriptionIdWorkflowService,
        private readonly _loadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService: LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService,
        private readonly _setAccountInfoAndProcessAfterLpzVerificationWorkflowService: SetAccountInfoAndProcessAfterLpzVerificationWorkflowService,
        private readonly _location: Location
    ) {
        translationsForComponentService.init(this);
        this.accountLookupForm = this._formBuilder.group({
            email: new FormControl(null, this._sxmValidators.emailForLookup),
            password: new FormControl(null, { validators: [this._sxmValidators.password], updateOn: 'blur' }),
        });
        this._passwordFormControl = this.accountLookupForm.get('password');
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'accountlookupvar2' }));
        this._loadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService.build().subscribe();
        this._store
            .select(getUserEnteredDataForOrganicCredentials)
            .pipe(
                take(1),
                filter(({ email, password }) => !!email && !!password)
            )
            .subscribe(({ email, password }) => {
                if (email) {
                    this.accountLookupForm.patchValue({ email });
                }
                if (password) {
                    this.accountLookupForm.patchValue({ password });
                }
            });
        if ((this._location?.getState() as any)?.passwordError) {
            this._passwordFormControl?.setErrors({ generic: true });
            this._passwordFormControl?.markAsTouched();
        }
    }

    doAccountLookup() {
        this.accountLookupForm.markAllAsTouched();
        this.accountLookupProcessing$.next(true);
        this.accountLookupFormSystemError = false;
        if (this.accountLookupForm.valid) {
            this._loadAccountFromEmailLookupWorkflowService.build(this.accountLookupForm.value).subscribe({
                next: () => {
                    this.accountLookupProcessing$.next(false);
                    this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { queryParamsHandling: 'preserve', relativeTo: this._activatedRoute });
                },
                error: (error: LoadAccountFromEmailLookupWorkflowError) => {
                    this.accountLookupProcessing$.next(false);
                    switch (error.type) {
                        case 'ACTIVE_STREAMING_SUBSCRIPTION': {
                            this.trackComponentImpression('overlay:signin');
                            this._subscriptionWithStreamingFoundModal.open();
                            break;
                        }
                        case 'EMAIL_ERROR_IN_USE': {
                            this.accountLookupForm.get('email').setErrors({ usernameInUse: true });
                            break;
                        }
                        case 'EMAIL_ERROR_INVALID': {
                            this.accountLookupForm.get('email').setErrors({ invalid: true });
                            break;
                        }
                        case 'PASSWORD_ERROR_POLICY': {
                            this.accountLookupForm.get('password').setErrors({ generic: true });
                            break;
                        }
                        case 'PASSWORD_ERROR_RESERVED_WORD': {
                            this.accountLookupForm.get('password').setErrors({ reservedWord: { word: error.reservedWord } });
                            break;
                        }
                        case 'SYSTEM': {
                            this.accountLookupFormSystemError = true;
                            break;
                        }
                    }
                },
            });
        } else {
            const errors = [];
            if (this.accountLookupForm.get('email').errors) {
                errors.push('Auth - Missing or invalid email');
            }
            if (this.accountLookupForm.get('password').errors) {
                errors.push('Checkout - Missing or invalid password');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this.accountLookupProcessing$.next(false);
        }
    }

    lpzValidated(valid: boolean) {
        if (valid) {
            this._setAccountInfoAndProcessAfterLpzVerificationWorkflowService
                .build()
                .pipe(
                    tap(() => {
                        this._router.navigate(['../payment'], { queryParamsHandling: 'preserve', relativeTo: this._activatedRoute });
                        this._lpzFormComponent.setProcessingCompleted();
                    }),
                    catchError((error: SetAccountInfoAndProcessAfterLpzVerificationWorkflowErrors) => {
                        if (error === 'OFFER_IS_FALLBACK') {
                            this.displayIneligibleLoader$.next(true);
                            return timer(5000).pipe(
                                tap(() => {
                                    this._router.navigate(['../payment'], { queryParamsHandling: 'preserve', relativeTo: this._activatedRoute });
                                    this.displayIneligibleLoader$.next(false);
                                })
                            );
                        }
                        this._lpzFormComponent.setProcessingCompleted();
                        return throwError(error);
                    })
                )
                .subscribe();
        } else {
            this._lpzFormComponent.setProcessingCompleted();
        }
    }

    onLoadingWithAlertMessageComplete(loadingCompleted: boolean) {
        if (loadingCompleted) {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Animation:notEligibleToPurchasePlan' }));
        }
    }

    onSubscribe(subscriptionId: string) {
        this._loadAccountFromSubscriptionIdWorkflowService.build({ subscriptionId }).subscribe(() => {
            this._lpzModal.open();
        });
    }

    trackComponentImpression(componentName: string) {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName }));
    }
}
