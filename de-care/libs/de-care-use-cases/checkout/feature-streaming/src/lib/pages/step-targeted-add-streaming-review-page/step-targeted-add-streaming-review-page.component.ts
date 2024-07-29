import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import {
    getOfferIncludesFees,
    getQuebecProvince,
    getQuoteViewModelForTargeted,
    getSelectedOfferOfferInfoLegalCopy,
    getSelectedOfferViewModel,
    getSelectedPlanMrdEligible,
    getShouldIncludeNuCaptcha,
    getReviewPostTrialViewModel,
    getIsRtpOrStepUpPlan,
    getSelectedOfferEtf,
    getLongDescriptionPlanRecapCardViewModel,
    SubmitPurchaseTargetedAddStreamingTransactionWorkflowErrors,
    SubmitPurchaseTargetedAddStreamingTransactionWorkflowService,
} from '@de-care/de-care-use-cases/checkout/state-streaming';
import {
    DeCareUseCasesCheckoutUiCommonModule,
    ReviewQuoteAndApproveFormComponent,
    ReviewQuoteAndApproveFormComponentApi,
} from '@de-care/de-care-use-cases/checkout/ui-common';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { combineLatest } from 'rxjs';
import { map, startWith, filter } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-targeted-add-streaming-review-page',
    templateUrl: './step-targeted-add-streaming-review-page.component.html',
    styleUrls: ['./step-targeted-add-streaming-review-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        DeCareUseCasesCheckoutUiCommonModule,
        DeCareSharedUiPageLayoutModule,
    ],
})
export class StepTargetedAddStreamingReviewPageComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    offerViewModel$ = this._store.select(getSelectedOfferViewModel);
    isOfferIncludeFee$ = this._store.select(getOfferIncludesFees);
    isQuebecProvince$ = this._store.select(getQuebecProvince);
    quoteViewModel$ = combineLatest([
        this._store.select(getQuoteViewModelForTargeted),
        this._store.select(getSelectedOfferEtf),
        this.translateService.onLangChange.pipe(startWith({ lang: this.translateService.currentLang })),
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
    getSelectedOfferOfferInfoLegalCopy$ = this._store.select(getSelectedOfferOfferInfoLegalCopy);
    @ViewChild(ReviewQuoteAndApproveFormComponent) private readonly _reviewQuoteAndApproveFormComponent: ReviewQuoteAndApproveFormComponentApi;
    getSelectedPlanMrdEligible$ = this._store.select(getSelectedPlanMrdEligible);
    postTrialViewModel$ = this._store.select(getReviewPostTrialViewModel);
    isRtpOrStepUpPlan$ = this._store.select(getIsRtpOrStepUpPlan);
    planRecapCardViewModel$ = this._store.select(getLongDescriptionPlanRecapCardViewModel);

    constructor(
        public readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _submitPurchaseTargetedAddStreamingTransactionWorkflowService: SubmitPurchaseTargetedAddStreamingTransactionWorkflowService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _store: Store,
        private readonly translateService: TranslateService,
        private readonly currencyPipe: CurrencyPipe
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'review' }));
    }

    submitForm() {
        this._submitPurchaseTargetedAddStreamingTransactionWorkflowService.build().subscribe({
            next: () => {
                this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute }).then(() => {
                    this._reviewQuoteAndApproveFormComponent.setProcessingCompleted();
                });
            },
            error: (error: SubmitPurchaseTargetedAddStreamingTransactionWorkflowErrors) => {
                this._reviewQuoteAndApproveFormComponent.setProcessingCompleted();
                switch (error) {
                    case 'CREDIT_CARD_FAILURE': {
                        this._router.navigate(['../payment'], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve', state: { mrdCCError: true } });
                        break;
                    }
                    case 'SYSTEM':
                    default: {
                        break;
                    }
                }
            },
        });
    }

    private getEtfPriceAndTermSubtext(etfData: { etfAmount: string; etfTerm: string }) {
        return this.translateService.instant(`${this.translateKeyPrefix}.PRICE_AND_TERM_SUBTEXT`, {
            etfAmount: this.currencyPipe.transform(etfData.etfAmount, 'USD', 'symbol-narrow', '1.0-0', this.translateService.currentLang),
            etfTerm: etfData.etfTerm,
        });
    }
}
