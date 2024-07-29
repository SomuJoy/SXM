import { CommonModule, DOCUMENT, Location } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, Inject, ViewChild, OnDestroy, NgModule } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import {
    LoadPurchaseOrganicReviewDataWorkflowService,
    SubmitPurchasePaymentInformationWorkflowError,
    SubmitPurchasePaymentInformationWorkflowService,
    resetSelectedPlanCodeToLeadOffer,
    getOrganicPaymentViewModel,
    skipUpdateOfferOnProvinceChange,
} from '@de-care/de-care-use-cases/checkout/state-streaming';
import {
    AccountInfoAndPaymentInfoFormComponent,
    AccountInfoAndPaymentInfoFormComponentApi,
    AccountInfoBasicAndPaymentInfoFormComponent,
    AccountInfoBasicAndPaymentInfoFormComponentApi,
    DeCareUseCasesCheckoutUiCommonModule,
    PaymentInfoWithFullAddressAndPhoneComponent,
    PaymentInfoWithPhoneNumberAndZipComponent,
} from '@de-care/de-care-use-cases/checkout/ui-common';
import { ProvinceSelection, PROVINCE_SELECTION } from '@de-care/de-care/shared/ui-province-selection';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiUiLoadingWithAlertMessageModule } from '@de-care/shared/sxm-ui/ui-loading-with-alert-message';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, forkJoin, Subscription, throwError, timer } from 'rxjs';
import { catchError, concatMap, filter, mapTo } from 'rxjs/operators';
import { TermUpsellFormComponentModule } from '../../page-parts/term-upsell-form/term-upsell-form.component';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-organic-payment-page',
    templateUrl: './step-organic-payment-page.component.html',
    styleUrls: ['./step-organic-payment-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveComponentModule,
        TermUpsellFormComponentModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiLoadingWithAlertMessageModule,
        DeCareSharedUiPageLayoutModule,
        // TODO: see about only bringing in what we need from here
        DeCareUseCasesCheckoutUiCommonModule,
        SharedSxmUiUiAlertPillModule,
        PaymentInfoWithPhoneNumberAndZipComponent,
        PaymentInfoWithFullAddressAndPhoneComponent,
    ],
})
export class StepOrganicPaymentPageComponent implements ComponentWithLocale, OnInit, AfterViewInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    isCountryUS = this.countrySettings?.countryCode?.toLowerCase() === 'us';
    displayIneligibleLoader$ = new BehaviorSubject(false);
    organicPaymentViewModel$ = this._store.select(getOrganicPaymentViewModel);
    @ViewChild(AccountInfoAndPaymentInfoFormComponent) private readonly _accountInfoAndPaymentInfoFormComponent: AccountInfoAndPaymentInfoFormComponentApi;
    @ViewChild(AccountInfoBasicAndPaymentInfoFormComponent) private readonly _accountInfoBasicAndPaymentInfoFormComponent: AccountInfoBasicAndPaymentInfoFormComponentApi;
    private _routerNavigationSubscription: Subscription;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _store: Store,
        @Inject(COUNTRY_SETTINGS) public readonly countrySettings: CountrySettingsToken,
        private readonly _submitPurchasePaymentInformationWorkflowService: SubmitPurchasePaymentInformationWorkflowService,
        private readonly _loadPurchaseOrganicReviewDataWorkflowService: LoadPurchaseOrganicReviewDataWorkflowService,
        @Inject(DOCUMENT) private readonly _document: Document,
        private readonly _location: Location,
        @Inject(PROVINCE_SELECTION) private readonly _provinceSelection: ProvinceSelection
    ) {
        translationsForComponentService.init(this);
        this._routerNavigationSubscription = this._router.events
            .pipe(
                // events that have restoredState are a result of back or forward, so we filter those events here
                filter((event) => event instanceof NavigationStart && !!event.restoredState)
            )
            .subscribe((event: NavigationStart) => {
                // determine if this is a "back" event by using the routeUrlNext value to check the route event url to determine if it was a "forward"
                const forwardUrlNormalized = this.pageStepRouteConfiguration.routeUrlNext.replace('..', '');
                if (!event.url.includes(forwardUrlNormalized)) {
                    // not a "forward" so it must be a "back" and we can do our logic here of resetting the selected plan code
                    this._store.dispatch(resetSelectedPlanCodeToLeadOffer());
                }
            });
    }

    ngOnDestroy(): void {
        this._routerNavigationSubscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentinfo' }));
        if ((this._location?.getState() as any)?.ccError) {
            this._accountInfoAndPaymentInfoFormComponent?.showCreditCardSubmissionError();
            this._accountInfoBasicAndPaymentInfoFormComponent?.showCreditCardSubmissionError();
        }
        if ((this._location?.getState() as any)?.systemError) {
            this._accountInfoAndPaymentInfoFormComponent?.showUnexpectedSubmissionError();
            this._accountInfoBasicAndPaymentInfoFormComponent?.showUnexpectedSubmissionError();
        }
    }

    onLoadingWithAlertMessageComplete($event: boolean) {
        if ($event) {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Animation:notEligibleToPurchasePlan' }));
        }
    }

    onPaymentInfoCollected({ paymentInfo }: Record<string, any>) {
        if (paymentInfo?.country?.toUpperCase() === 'CA') {
            this._store.dispatch(skipUpdateOfferOnProvinceChange());
            this._provinceSelection?.setSelectedProvince(paymentInfo?.state);
            this._provinceSelection?.setProvinceCanBeChanged(false);
        }
        this._submitPurchasePaymentInformationWorkflowService
            .build({ paymentInfo })
            .pipe(
                concatMap(() => this._loadPurchaseOrganicReviewDataWorkflowService.build({ loadFallback: false })),
                catchError((error: SubmitPurchasePaymentInformationWorkflowError) => {
                    if (error === 'NOT_ELIGIBLE_FOR_OFFER') {
                        this.displayIneligibleLoader$.next(true);
                        this._document.body.scrollTop = 0;
                        return forkJoin([timer(5000), this._loadPurchaseOrganicReviewDataWorkflowService.build({ loadFallback: true })]).pipe(mapTo(true));
                    }
                    return throwError(error);
                })
            )
            .subscribe({
                next: () => {
                    this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { queryParamsHandling: 'preserve', relativeTo: this._activatedRoute });
                    this.displayIneligibleLoader$.next(false);
                    this._accountInfoAndPaymentInfoFormComponent?.setProcessingCompleted();
                    this._accountInfoBasicAndPaymentInfoFormComponent?.setProcessingCompleted();
                },
                error: (error) => {
                    if (error === 'CREDIT_CARD_FAILURE') {
                        this._accountInfoAndPaymentInfoFormComponent?.showCreditCardSubmissionError();
                        this._accountInfoBasicAndPaymentInfoFormComponent?.showCreditCardSubmissionError();
                    } else {
                        // TODO: show system error message
                        this.displayIneligibleLoader$.next(false);
                        this._accountInfoAndPaymentInfoFormComponent?.setProcessingCompleted();
                        this._accountInfoBasicAndPaymentInfoFormComponent?.setProcessingCompleted();
                    }
                },
            });
    }
}
