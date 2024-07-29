// ===============================================================================
// Angular
import { Input, OnDestroy, OnInit, OnChanges, SimpleChanges, Component } from '@angular/core';
import { formatDate, CurrencyPipe, I18nPluralPipe } from '@angular/common';

// ===============================================================================
// Import Models
import { DataLayerActionEnum, isOfferMCP, PlanTypeEnum } from '@de-care/data-services';

import { SharedEventTrackService } from '@de-care/data-layer';
import { TranslateService, TranslateParser } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { AccordionChevronInfo } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { QuoteModel } from '@de-care/domains/quotes/state-quote';
import { QuoteMapViewModel, QuoteViewModel, QuoteExtraData } from '@de-care/domains/quotes/state-quote-presentment';

const EmptyQuoteMap: QuoteMapViewModel = {
    currentQuote: null,
    futureQuote: null,
    promoRenewalQuote: null,
    proRatedRenewalQuote: null,
    renewalQuote: null,
};
interface SharedOrderSummaryTranslationParams {
    amount?: number;
    startDate?: string;
    endDate?: string;
    term?: string;
}

@Component({
    selector: 'quote-summary',
    templateUrl: './quote-summary.component.html',
    styleUrls: ['./quote-summary.component.scss'],
    providers: [CurrencyPipe, I18nPluralPipe],
})
export class QuoteSummaryComponent implements OnDestroy, OnInit, OnChanges {
    @Input() giftCardUsed: boolean;
    @Input() isClosedRadio: boolean;
    @Input() isClosedStreaming: boolean;
    @Input() isCurrentSubscriptionTrial: boolean;
    @Input() currentSubscriptionEndDate: string;
    @Input() isNewAccount: boolean;
    @Input() isStreamingFlow: boolean;
    @Input() isStudentFlow = false;
    @Input() priceChangeMessagingType: string;
    @Input() priceChangeMessagingTypeFeatureFlag: boolean;
    @Input() showUnusedCreditLine = false;
    @Input() expandOrderSummaryDetails: boolean;
    @Input() showHeadlineSeeOfferDetails: boolean = true;
    @Input() isChangeSubscription: boolean = false;
    @Input() leadOfferHasEtfAmount: boolean = false;
    @Input() quote: QuoteModel = null;
    @Input() leadOfferPackageName: string;
    isMCP: boolean;
    @Input() isDataOnlyTrial: boolean = false;
    @Input() extraData: QuoteExtraData;
    @Input() headlinePresent: boolean;
    @Input() isQCProvince: boolean;
    //================================================
    //===                Variables                 ===
    //================================================
    QuoteTp: SharedOrderSummaryTranslationParams;
    firstTotalAmount: number = null;
    quotesArray: QuoteViewModel[] = [];
    quotesMap: QuoteMapViewModel = EmptyQuoteMap;
    math = Math;
    trackViewToolTip: string = 'viewToolTip';
    trackComponentName: string = 'order-summary';
    currentLang: string;
    isCanada = false;
    tranlateFeesAndTaxes = false;
    premierFullPrice: number;
    promoPrice: number;
    endDateForNote: string;
    termLengthImportantNote: number;

    translateKeyPrefix = 'DomainsQuotesUiCurrentQuoteModule.CurrentQuoteComponent';

    private _unsubscribe: Subject<void> = new Subject();
    //================================================
    //===            Lifecycle events              ===
    //================================================
    constructor(
        private _eventTrackService: SharedEventTrackService,
        private _currencyPipe: CurrencyPipe,
        private _i18nPluralPipe: I18nPluralPipe,
        private _settings: SettingsService,
        private readonly translateService: TranslateService,
        private readonly translateParser: TranslateParser,
        public readonly userSettingsService: UserSettingsService
    ) {
        this.currentLang = this.translateService.currentLang;
        this.translateService.onLangChange.pipe(takeUntil(this._unsubscribe)).subscribe((ev) => {
            this.currentLang = ev.lang;

            if (this.quote) {
                this.processQuotes(this.quote);
            }
        });
    }

    //================================================
    //===              Helper Methods              ===
    //================================================
    ngOnChanges(changes: SimpleChanges) {
        if (changes.quote && changes.quote.currentValue) {
            this.processQuotes(changes.quote.currentValue);
        }
    }

    ngOnInit() {
        this.isCanada = this._settings.isCanadaMode;
        this.tranlateFeesAndTaxes = this.isCanada;

        this.userSettingsService.dateFormat$.pipe(takeUntil(this._unsubscribe)).subscribe((dateFormatValue) => {
            this._mapQuotesData(this.translateService.currentLang, dateFormatValue);
        });
    }

    private _mapQuotesData(locale: string, dateFormat: string) {
        this.quotesMap = {
            currentQuote: null,
            futureQuote: null,
            promoRenewalQuote: null,
            proRatedRenewalQuote: null,
            renewalQuote: null,
        };
        this.isMCP = this.quotesArray.some((quoteObject) => isOfferMCP(<PlanTypeEnum>quoteObject.quote?.details?.[0]?.type));

        this.quotesArray.forEach((data) => {
            const details = data.quote.details?.[0];
            const termLengthPluralMap = this.translateService.instant('quotes.orderSummaryComponent.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.LENGTH');
            const termString = this._i18nPluralPipe.transform(details?.termLength, termLengthPluralMap);
            const termLength = this.translateParser.interpolate(termString, { termLength: details?.termLength });

            data.QuoteTp = {
                ...data.QuoteTp,
                term: termLength,
                amount: this.parseCurrency(data.originalAmount),
                startDate: data.originalStartDate ? formatDate(data.originalStartDate, dateFormat, locale) : null,
                endDate: data.originalEndDate ? formatDate(data.originalEndDate, dateFormat, locale) : null,
            };

            this.quotesMap[data.quoteType] = { ...data };
        });

        if (this.isStudentFlow) {
            const promoRenewalQuote = this.quotesMap.promoRenewalQuote;
            const currentQuote = this.quotesMap.currentQuote;
            if (promoRenewalQuote) {
                this.termLengthImportantNote = promoRenewalQuote.termLength;
            } else if (currentQuote) {
                this.termLengthImportantNote = currentQuote.termLength;
            }
            if (currentQuote) {
                this.endDateForNote = formatDate(currentQuote.originalEndDate, dateFormat, locale);
                currentQuote.endDateForNote = this.endDateForNote;
            }
        }
    }

    viewDetails($event: AccordionChevronInfo, quoteType: string, quoteInsideContentContainer: boolean, isProrated: boolean): void {
        if ($event.clickCount === 1) {
            this._eventTrackService.track(DataLayerActionEnum.DetailsAccordionChevron, {
                componentName: this.trackComponentName,
                quoteType,
                isProrated,
                quoteInsideContentContainer,
            });
        }
    }

    chevronClicked({ $event, quoteType, quoteInsideContentContainer, isProrated }): void {
        this.viewDetails($event, quoteType, quoteInsideContentContainer, isProrated);
    }

    viewToolTip(name: string): void {
        this._eventTrackService.track(this.trackViewToolTip, { componentName: this.trackComponentName, name: name });
    }

    viewToolTipClicked(name: string): void {
        this.viewToolTip(name);
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private parseQuoteKeyToTranslateKey(key: string): string {
        switch (key) {
            case 'currentQuote':
                return 'CURRENT_QUOTE';
            case 'futureQuote':
                return 'FUTURE_QUOTE';
            case 'proRatedRenewalQuote':
                return 'PRORATED_RENEWAL_QUOTE';
            case 'promoRenewalQuote':
                return 'PROMO_RENEWAL_QUOTE';
            case 'renewalQuote':
                return 'RENEWAL_QUOTE';
            default:
                return '';
        }
    }

    private parseCurrency(price: number): string {
        return this._currencyPipe.transform(price, 'USD', 'symbol-narrow', undefined, this.translateService.currentLang);
    }

    private processQuotes(quote: QuoteModel) {
        let dealAdded = false;
        this.quotesArray = [];
        const termLengthPluralMap = this.translateService.instant('quotes.orderSummaryComponent.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.LENGTH');
        let counter = 0;

        Object.entries(quote).forEach(([key, value]) => {
            if (value !== null) {
                this.firstTotalAmount = this.firstTotalAmount === null ? value.totalAmount : this.firstTotalAmount;
                const details = value.details?.[0];
                const termString = this._i18nPluralPipe.transform(details?.termLength, termLengthPluralMap);
                const termLength = this.translateParser.interpolate(termString, { termLength: details?.termLength });
                const isMCP = isOfferMCP(details?.type);
                const originalAmount = value.totalAmount ? value.totalAmount : this.firstTotalAmount;
                const originalStartDate = details?.startDate;
                const originalEndDate = details?.endDate;
                const quoteLoop: Omit<QuoteViewModel, 'index'> = {
                    headlinePresent: this.quotesArray.length ? false : true,
                    quoteType: key,
                    quoteLangKey: this.parseQuoteKeyToTranslateKey(key),
                    quote: value,
                    originalAmount,
                    originalStartDate,
                    originalEndDate,
                    QuoteTp: {
                        amount: this.parseCurrency(originalAmount),
                        isMrdEligible: value.details?.[0]?.isMrdEligible,
                        term: termLength,
                    },
                    hasBalance: +value.previousBalance > 0 ? true : false,
                    hasCredit: +value.previousBalance < 0 ? true : false,
                    isMCP,
                    isStudentQuote: details?.isStudent,
                    termLength: details?.termLength,
                };
                if (quoteLoop.hasOwnProperty('deal')) {
                    // makes it so the deal object (if it exists) only gets added to the first quote
                    dealAdded = true;
                }
                if (!(key === 'renewalQuote' && this.isStudentFlow)) {
                    this.quotesArray.push({ ...quoteLoop, index: counter++ });
                }
                if (key === 'renewalQuote' && this.isStudentFlow) {
                    this.premierFullPrice = value.pricePerMonth || null;
                }
                if (key === 'promoRenewalQuote' && this.isStudentFlow) {
                    this.promoPrice = originalAmount || null;
                }
            }
        });

        this.userSettingsService.dateFormat$.pipe(take(1)).subscribe((dateFormat) => {
            this._mapQuotesData(this.translateService.currentLang, dateFormat);
        });
    }
}
