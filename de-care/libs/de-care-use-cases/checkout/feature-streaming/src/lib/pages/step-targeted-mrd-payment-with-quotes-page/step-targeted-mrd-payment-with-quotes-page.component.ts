import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { COUNTRY_SETTINGS, CountrySettingsToken } from '@de-care/shared/configuration-tokens-locales';
import { PaymentInfoBasicData, PaymentInfoBasicWithQuotesComponent, PaymentInfoBasiWithQuotesFormComponentApi } from '@de-care/de-care-use-cases/checkout/ui-common';
import {
    getOfferIncludesFees,
    getPlanRecapCardViewModel,
    getQuebecProvince,
    getQuoteViewModel,
    getSelectedOfferOfferInfoLegalCopy,
    getSelectedOfferViewModel,
    getSelectedPlanMrdEligible,
    getShouldIncludeNuCaptcha,
    LoadPurchaseReviewDataForMrdWorkflowService,
    SubmitPurchaseTargetedTransactionWorkflowErrors,
    SubmitPurchaseTargetedTransactionWorkflowService,
    SubmitPurchasePaymentInformationForMrdWorkflowError,
    SubmitPurchasePaymentInformationForMrdWorkflowService,
} from '@de-care/de-care-use-cases/checkout/state-streaming';
import { catchError, concatMap, mapTo } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, throwError, timer } from 'rxjs';
import { DOCUMENT, Location } from '@angular/common';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { getPaymentInfo } from '@de-care/de-care-use-cases/checkout/state-streaming';
import { Store } from '@ngrx/store';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-targeted-mrd-payment-with-quotes-page',
    templateUrl: './step-targeted-mrd-payment-with-quotes-page.component.html',
    styleUrls: ['./step-targeted-mrd-payment-with-quotes-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepTargetedMrdPaymentWithQuotesPageComponent implements ComponentWithLocale, OnInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    displayIneligibleLoader$ = new BehaviorSubject(false);
    getPaymentInfo$ = this._store.select(getPaymentInfo);
    offerViewModel$ = this._store.select(getSelectedOfferViewModel);
    quoteViewModel$ = this._store.select(getQuoteViewModel);
    isQuebecProvince$ = this._store.select(getQuebecProvince);
    isOfferIncludeFee$ = this._store.select(getOfferIncludesFees);
    getSelectedPlanMrdEligible$ = this._store.select(getSelectedPlanMrdEligible);
    planRecapCardViewModel$ = this._store.select(getPlanRecapCardViewModel);
    getSelectedOfferOfferInfoLegalCopy$ = this._store.select(getSelectedOfferOfferInfoLegalCopy);
    displayNuCaptcha$ = this._store.select(getShouldIncludeNuCaptcha);
    @ViewChild(PaymentInfoBasicWithQuotesComponent) private readonly _paymentInfoBasiWithQuotesFormComponentApi: PaymentInfoBasiWithQuotesFormComponentApi;
    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _location: Location,
        private readonly _submitPurchasePaymentInformationForMrdWorkflowService: SubmitPurchasePaymentInformationForMrdWorkflowService,
        private readonly _loadPurchaseReviewDataForMrdWorkflowService: LoadPurchaseReviewDataForMrdWorkflowService,
        private readonly _submitPurchaseTargetedTransactionWorkflowService: SubmitPurchaseTargetedTransactionWorkflowService,
        @Inject(DOCUMENT) private readonly _document: Document,
        @Inject(COUNTRY_SETTINGS) public readonly countrySettings: CountrySettingsToken
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentinfoandreview' }));
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    private _scrollToTop() {
        this._document.body.scrollTop = 0;
    }

    onPaymentInfoCollected({ paymentInfo }: PaymentInfoBasicData) {
        this._submitPurchasePaymentInformationForMrdWorkflowService
            .build({ paymentInfo })
            .pipe(
                concatMap(() => this._loadPurchaseReviewDataForMrdWorkflowService.build({ loadFallback: false })),
                catchError((error: SubmitPurchasePaymentInformationForMrdWorkflowError) => {
                    if (error === 'NOT_ELIGIBLE_FOR_OFFER') {
                        this.displayIneligibleLoader$.next(true);
                        this._scrollToTop();
                        return forkJoin([timer(5000), this._loadPurchaseReviewDataForMrdWorkflowService.build({ loadFallback: true })]).pipe(mapTo(true));
                    }
                    return throwError(error);
                })
            )
            .subscribe({
                next: () => {
                    this.displayIneligibleLoader$.next(false);
                    this._paymentInfoBasiWithQuotesFormComponentApi?.setProcessingCompleted();
                },
                error: () => {
                    // TODO: show system error message
                    this.displayIneligibleLoader$.next(false);
                    this._paymentInfoBasiWithQuotesFormComponentApi?.setProcessingCompleted();
                },
            });
    }

    onLoadingWithAlertMessageComplete($event: boolean) {
        if ($event) {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Animation:notEligibleToPurchasePlan' }));
        }
    }

    submitForm() {
        this._submitPurchaseTargetedTransactionWorkflowService.build().subscribe({
            next: () => {
                this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute }).then(() => {
                    this._paymentInfoBasiWithQuotesFormComponentApi.setProcessingCompleted();
                });
            },
            error: (error: SubmitPurchaseTargetedTransactionWorkflowErrors) => {
                this._paymentInfoBasiWithQuotesFormComponentApi.setProcessingCompleted();
                switch (error) {
                    case 'CREDIT_CARD_FAILURE': {
                        this._paymentInfoBasiWithQuotesFormComponentApi.showCreditCardSubmissionError();
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
}
