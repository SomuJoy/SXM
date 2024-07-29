import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, ViewChild, OnDestroy, NgModule, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    getOfferIncludesFees,
    getLongDescriptionPlanRecapCardViewModel,
    getQuebecProvince,
    getQuoteViewModel,
    getShouldIncludeNuCaptcha,
    SubmitPurchaseOrganicTransactionWorkflowErrors,
    SubmitPurchaseOrganicTransactionWorkflowService,
    getSelectedOfferEtf,
    getSelectedOfferForReviewStepViewModel,
    getSelectedOfferIsStepUpPlan,
} from '@de-care/de-care-use-cases/checkout/state-streaming';
import {
    DeCareUseCasesCheckoutUiCommonModule,
    ReviewQuoteAndApproveFormComponent,
    ReviewQuoteAndApproveFormComponentApi,
} from '@de-care/de-care-use-cases/checkout/ui-common';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { map, startWith, filter } from 'rxjs/operators';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Subject, combineLatest } from 'rxjs';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { COUNTRY_SETTINGS, CountrySettingsToken } from '@de-care/shared/configuration-tokens-locales';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-organic-review-page',
    templateUrl: './step-organic-review-page.component.html',
    styleUrls: ['./step-organic-review-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepOrganicReviewPageComponent implements ComponentWithLocale, OnInit, AfterViewInit, OnDestroy {
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    isCountryUS = this.countrySettings?.countryCode?.toLowerCase() === 'us';
    isStepUpPlan$ = this._store.select(getSelectedOfferIsStepUpPlan);
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    offerViewModel$ = this._store.select(getSelectedOfferForReviewStepViewModel);
    planRecapCardViewModel$ = this._store.select(getLongDescriptionPlanRecapCardViewModel);
    isOfferIncludeFee$ = this._store.select(getOfferIncludesFees);
    // TODO: this should be changed to what it is doing for the UI and not isQuebec
    isQuebecProvince$ = this._store.select(getQuebecProvince);
    quoteViewModel$ = combineLatest([
        this._store.select(getQuoteViewModel),
        this._store.select(getSelectedOfferEtf),
        this._translateService.onLangChange.pipe(startWith({ lang: this._translateService.currentLang })),
    ]).pipe(
        filter(([quotes]) => !!quotes),
        map(([quotes, etfData]) => {
            if (etfData && quotes.currentQuote) {
                const details = quotes.currentQuote.details.map((detail) => {
                    if (detail.packageName !== 'AMZ_DOT') {
                        return {
                            ...detail,
                            priceAndTermSubText: this.getEtfPriceAndTermSubtext(etfData),
                        };
                    }
                    return detail;
                });
                return {
                    ...quotes,
                    currentQuote: {
                        ...quotes.currentQuote,
                        details: details,
                    },
                };
            }
            return quotes;
        })
    );
    displayNuCaptcha$ = this._store.select(getShouldIncludeNuCaptcha);
    @ViewChild(ReviewQuoteAndApproveFormComponent) private readonly _reviewQuoteAndApproveFormComponent: ReviewQuoteAndApproveFormComponentApi;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _store: Store,
        private _translateService: TranslateService,
        private readonly _currencyPipe: CurrencyPipe,
        private readonly _submitPurchaseOrganicTransactionWorkflowService: SubmitPurchaseOrganicTransactionWorkflowService,
        @Inject(COUNTRY_SETTINGS) public readonly countrySettings: CountrySettingsToken
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'review' }));
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    submitTransaction() {
        this._submitPurchaseOrganicTransactionWorkflowService.build().subscribe({
            next: () => {
                this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute, replaceUrl: true }).then(() => {
                    this._reviewQuoteAndApproveFormComponent.setProcessingCompleted();
                });
            },
            error: (error: SubmitPurchaseOrganicTransactionWorkflowErrors) => {
                this._reviewQuoteAndApproveFormComponent.setProcessingCompleted();
                switch (error) {
                    case 'CREDIT_CARD_FAILURE': {
                        this._router.navigate([this.pageStepRouteConfiguration.paymentMethodRouteUrl], {
                            relativeTo: this._activatedRoute,
                            queryParamsHandling: 'preserve',
                            state: { ccError: true },
                        });
                        break;
                    }
                    case 'PASSWORD_POLICY_FAILURE': {
                        this._router.navigate([this.pageStepRouteConfiguration.credentialsRouteUrl], {
                            relativeTo: this._activatedRoute,
                            queryParamsHandling: 'preserve',
                            state: { passwordError: true },
                        });
                        break;
                    }
                    case 'PASSWORD_HAS_PII_DATA_ERROR': {
                        this._router.navigate([this.pageStepRouteConfiguration.credentialsRouteUrl], {
                            relativeTo: this._activatedRoute,
                            queryParamsHandling: 'preserve',
                            state: { passwordHasPiiDataError: true },
                        });
                        break;
                    }
                    default: {
                        this._router.navigate([this.pageStepRouteConfiguration.paymentMethodRouteUrl], {
                            relativeTo: this._activatedRoute,
                            queryParamsHandling: 'preserve',
                            state: { systemError: true },
                        });
                        break;
                    }
                }
            },
        });
    }

    private getEtfPriceAndTermSubtext(etfData: { etfAmount: string; etfTerm: string }) {
        return this._translateService.instant(`${this.translateKeyPrefix}.PRICE_AND_TERM_SUBTEXT`, {
            etfAmount: this._currencyPipe.transform(etfData.etfAmount, 'USD', 'symbol-narrow', '1.0-0', this._translateService.currentLang),
            etfTerm: etfData.etfTerm,
        });
    }
}

@NgModule({
    declarations: [StepOrganicReviewPageComponent],
    exports: [StepOrganicReviewPageComponent],
    imports: [
        CommonModule,
        TranslateModule,
        SharedSxmUiUiAlertPillModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        DeCareSharedUiPageLayoutModule,
        // TODO: see about only bringing in what we need from here
        DeCareUseCasesCheckoutUiCommonModule,
    ],
    providers: [CurrencyPipe],
})
export class StepOrganicReviewPageComponentModule {}
