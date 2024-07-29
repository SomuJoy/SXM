import { CurrencyPipe, DOCUMENT } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    getOfferIncludesFees,
    getLongDescriptionPlanRecapCardViewModel,
    getQuebecProvince,
    getUserEnteredDataForOrganicPaymentInfo,
    LoadPurchaseOrganicReviewDataWorkflowService,
    SubmitPurchasePaymentInformationWorkflowError,
    SubmitPurchasePaymentInformationWorkflowService,
    getSelectedOfferEtf,
    getSelectedOfferViewModel,
    getQuoteViewModel,
    getShouldIncludeNuCaptcha,
    SubmitPurchaseOrganicTransactionWorkflowErrors,
    SubmitPurchaseOrganicTransactionWorkflowService,
    LoadPurchaseCombinedPaymentWithQuotesDataWorkflowService,
} from '@de-care/de-care-use-cases/checkout/state-streaming';
import {
    AccountInfoAndPaymentInfoData,
    AccountInfoAndPaymentInfoWithQuotesFormComponent,
    AccountInfoAndPaymentInfoWithQuotesFormComponentApi,
    AccountInfoBasicAndPaymentInfoWithQuotesFormComponent,
    AccountInfoBasicAndPaymentInfoWithQuotesFormComponentApi,
} from '@de-care/de-care-use-cases/checkout/ui-common';
import { ProvinceSelection, PROVINCE_SELECTION } from '@de-care/de-care/shared/ui-province-selection';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, forkJoin, Subject, Subscription, timer } from 'rxjs';
import { concatMap, filter, map, mapTo, startWith, take, tap } from 'rxjs/operators';
import { GetPageStepRouteConfiguration, PageStepRouteConfiguration } from '../../routing/page-step-route-configuration';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'step-organic-payment-page',
    templateUrl: './step-organic-payment-with-quotes-page.component.html',
    styleUrls: ['./step-organic-payment-with-quotes-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepOrganicPaymentWithQuotesPageComponent implements ComponentWithLocale, OnInit, AfterViewInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    pageStepRouteConfiguration: PageStepRouteConfiguration;
    paymentInfoFormVersion = this.countrySettings?.countryCode?.toLowerCase() === 'ca' ? 'FULL' : 'BASIC';
    displayIneligibleLoader$ = new BehaviorSubject(false);
    planRecapCardViewModel$ = this._store.select(getLongDescriptionPlanRecapCardViewModel);
    isOfferIncludeFee$ = this._store.select(getOfferIncludesFees);
    combinedPurchaseDataSubs: Subscription;
    // TODO: this should be changed to what it is doing for the UI and not isQuebec
    isQuebecProvince$ = this._store.select(getQuebecProvince);
    @ViewChild(AccountInfoAndPaymentInfoWithQuotesFormComponent)
    private readonly _accountInfoAndPaymentInfoWithQuotesFormComponentApi: AccountInfoAndPaymentInfoWithQuotesFormComponentApi;
    @ViewChild(AccountInfoBasicAndPaymentInfoWithQuotesFormComponent)
    private readonly _accountInfoBasicAndPaymentInfoFormComponent: AccountInfoBasicAndPaymentInfoWithQuotesFormComponentApi;

    private _destroy$: Subject<boolean> = new Subject<boolean>();
    private _userEnteredPaymentInfo$ = this._store.select(getUserEnteredDataForOrganicPaymentInfo).pipe(
        take(1),
        filter((paymentInfo) => !!paymentInfo)
    );
    paymentFormInitialState$ = this._userEnteredPaymentInfo$.pipe(
        map((paymentInfo) => ({
            firstName: paymentInfo?.firstName,
            lastName: paymentInfo?.lastName,
            phoneNumber: paymentInfo?.phoneNumber,
            address: {
                addressLine1: paymentInfo?.serviceAddress?.addressLine1,
                city: paymentInfo?.serviceAddress?.city,
                state: paymentInfo?.serviceAddress?.state,
                zip: paymentInfo?.serviceAddress?.zip,
            },
            creditCard: paymentInfo?.creditCard,
        }))
    );
    paymentFormBasicInitialState$ = this._userEnteredPaymentInfo$.pipe(
        map((paymentInfo) => ({
            firstName: paymentInfo?.firstName,
            lastName: paymentInfo?.lastName,
            phoneNumber: paymentInfo?.phoneNumber,
            zip: paymentInfo?.serviceAddress?.zip,
            creditCard: paymentInfo?.creditCard,
        }))
    );

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
    offerViewModel$ = this._store.select(getSelectedOfferViewModel);
    displayNuCaptcha$ = this._store.select(getShouldIncludeNuCaptcha);

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _store: Store,
        @Inject(COUNTRY_SETTINGS) public readonly countrySettings: CountrySettingsToken,
        private readonly _submitPurchasePaymentInformationWorkflowService: SubmitPurchasePaymentInformationWorkflowService,
        private readonly _loadPurchaseOrganicReviewDataWorkflowService: LoadPurchaseOrganicReviewDataWorkflowService,
        @Inject(DOCUMENT) private readonly _document: Document,
        private readonly _translateService: TranslateService,
        @Inject(PROVINCE_SELECTION) private readonly _provinceSelection: ProvinceSelection,
        private readonly _currencyPipe: CurrencyPipe,
        private readonly _submitPurchaseOrganicTransactionWorkflowService: SubmitPurchaseOrganicTransactionWorkflowService,
        private readonly _loadPurchaseCombinedPaymentWithQuotesDataWorkflowService: LoadPurchaseCombinedPaymentWithQuotesDataWorkflowService
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.pageStepRouteConfiguration = GetPageStepRouteConfiguration(this._activatedRoute);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentinfoandreview' }));
    }

    onLoadingWithAlertMessageComplete($event: boolean) {
        if ($event) {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Animation:notEligibleToPurchasePlan' }));
        }
    }

    onZipCodeCollected({ paymentInfo }: AccountInfoAndPaymentInfoData) {
        if (paymentInfo?.country?.toUpperCase() === 'CA') {
            this._provinceSelection?.setSelectedProvince(paymentInfo?.state);
            this._provinceSelection?.setProvinceCanBeChanged(false);
        }
        this.combinedPurchaseDataSubs?.unsubscribe();
        this.combinedPurchaseDataSubs = this._loadPurchaseCombinedPaymentWithQuotesDataWorkflowService
            .build({
                city: paymentInfo.city,
                state: paymentInfo.state,
                postalCode: paymentInfo.zip,
                country: paymentInfo.country,
            })
            .subscribe({
                next: () => {
                    this._accountInfoAndPaymentInfoWithQuotesFormComponentApi?.setProcessingCompleted();
                    this._accountInfoBasicAndPaymentInfoFormComponent?.setProcessingCompleted();
                },
                error: () => {
                    this._accountInfoAndPaymentInfoWithQuotesFormComponentApi?.showUnexpectedSubmissionError();
                    this._accountInfoBasicAndPaymentInfoFormComponent?.showUnexpectedSubmissionError();
                },
            });
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    handleIneligibleOffer() {
        this.displayIneligibleLoader$.next(true);
        this._document.body.scrollTop = 0;
        return forkJoin([timer(5000), this._loadPurchaseOrganicReviewDataWorkflowService.build({ loadFallback: true })])
            .pipe(
                mapTo(true),
                tap(() => {
                    this.displayIneligibleLoader$.next(false);
                })
            )
            .subscribe(() => {
                this._accountInfoAndPaymentInfoWithQuotesFormComponentApi?.resetFallbackLoadedFields();
                this._accountInfoBasicAndPaymentInfoFormComponent?.resetFallbackLoadedFields();
                this._accountInfoAndPaymentInfoWithQuotesFormComponentApi?.setProcessingCompleted();
                this._accountInfoBasicAndPaymentInfoFormComponent?.setProcessingCompleted();
            });
    }

    submitTransaction({ paymentInfo }: AccountInfoAndPaymentInfoData) {
        this._submitPurchasePaymentInformationWorkflowService
            .build({ paymentInfo })
            .pipe(concatMap(() => this._submitPurchaseOrganicTransactionWorkflowService.build()))
            .subscribe({
                next: () => {
                    this._router.navigate([this.pageStepRouteConfiguration.routeUrlNext], { relativeTo: this._activatedRoute, replaceUrl: true }).then(() => {
                        this._accountInfoAndPaymentInfoWithQuotesFormComponentApi?.setProcessingCompleted();
                        this._accountInfoBasicAndPaymentInfoFormComponent?.setProcessingCompleted();
                    });
                },
                error: (error: SubmitPurchaseOrganicTransactionWorkflowErrors | SubmitPurchasePaymentInformationWorkflowError) => {
                    this._accountInfoAndPaymentInfoWithQuotesFormComponentApi?.setProcessingCompleted();
                    this._accountInfoBasicAndPaymentInfoFormComponent?.setProcessingCompleted();
                    switch (error) {
                        case 'NOT_ELIGIBLE_FOR_OFFER': {
                            this.handleIneligibleOffer();
                            break;
                        }
                        case 'CREDIT_CARD_FAILURE': {
                            this.displayCCError();
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
                        default: {
                            this.displaySystemError();
                            break;
                        }
                    }
                },
            });
    }

    private displayCCError() {
        this._accountInfoAndPaymentInfoWithQuotesFormComponentApi?.showCreditCardSubmissionError();
        this._accountInfoBasicAndPaymentInfoFormComponent?.showCreditCardSubmissionError();
    }

    private displaySystemError() {
        this._accountInfoAndPaymentInfoWithQuotesFormComponentApi?.showUnexpectedSubmissionError();
        this._accountInfoBasicAndPaymentInfoFormComponent?.showUnexpectedSubmissionError();
    }

    private getEtfPriceAndTermSubtext(etfData: { etfAmount: string; etfTerm: string }) {
        return this._translateService.instant(`${this.translateKeyPrefix}.PRICE_AND_TERM_SUBTEXT`, {
            etfAmount: this._currencyPipe.transform(etfData.etfAmount, 'USD', 'symbol-narrow', '1.0-0', this._translateService.currentLang),
            etfTerm: etfData.etfTerm,
        });
    }
}
