// ===============================================================================
// Angular
import { Input, OnDestroy, OnInit, Injectable, Directive, OnChanges, SimpleChanges } from '@angular/core';
import { formatDate, CurrencyPipe, I18nPluralPipe } from '@angular/common';

// ===============================================================================
// Import Models
import { QuoteModel, DataLayerActionEnum, PlanTypeEnum, isOfferMCP } from '@de-care/data-services';
import { SharedEventTrackService } from '@de-care/data-layer';
import { TranslateService, TranslateParser } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { AccordionChevronInfo } from '@de-care/shared/sxm-ui/ui-accordion-chevron';

interface SharedOrderSummaryTranslationParams {
    amount?: number;
    startDate?: string;
    endDate?: string;
    term?: string;
}

@Directive()
@Injectable()
export class OrderSummaryBaseComponent implements OnDestroy, OnInit, OnChanges {
    @Input() giftCardUsed: boolean;
    @Input() isClosedRadio: boolean;
    @Input() isClosedStreaming: boolean;
    @Input() isCurrentSubscriptionTrial: boolean;
    @Input() isNewAccount: boolean;
    @Input() isStreamingFlow: boolean;
    @Input() isStudentFlow = false;
    @Input() showUnusedCreditLine = false;
    @Input() expandOrderSummaryDetails: boolean;
    @Input() showHeadlineSeeOfferDetails: boolean = true;
    @Input() isChangeSubscription: boolean = false;
    @Input() quote: QuoteModel = null;
    isMCP: boolean;
    @Input() isDataOnlyTrial: boolean = false;
    //================================================
    //===                Variables                 ===
    //================================================
    QuoteTp: SharedOrderSummaryTranslationParams;
    firstTotalAmount: number = null;
    quotesArray: Array<any> = [];
    quotesMap = {};
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
    private _unsubscribe: Subject<void> = new Subject();
    //================================================
    //===            Lifecycle events              ===
    //================================================
    constructor(
        private _eventTrackService: SharedEventTrackService,
        private _currencyPipe: CurrencyPipe,
        private _i18nPluralPipe: I18nPluralPipe,
        private _settings: SettingsService,
        public translateService: TranslateService,
        public translateParser: TranslateParser,
        public userSettingsService: UserSettingsService
    ) {
        // set properties are set before ngOnInit, is mandatory to set the lang here for this specific case
        this.currentLang = this.translateService.currentLang;
        this.translateService.onLangChange.pipe(takeUntil(this._unsubscribe)).subscribe((ev) => {
            this.currentLang = ev.lang;
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
        this.quotesMap = {};

        this.quotesArray.forEach((data, index) => {
            const details = data.quote.details[0];
            const termLengthPluralMap = this.translateService.instant('quotes.orderSummaryComponent.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.LENGTH');
            const termString = this._i18nPluralPipe.transform(details.termLength, termLengthPluralMap);
            const termLength = this.translateParser.interpolate(termString, { termLength: details.termLength });

            data.QuoteTp = {
                ...data.QuoteTp,
                term: termLength,
                amount: this.parseCurrency(data.originalAmount),
                startDate: formatDate(data.originalStartDate, dateFormat, locale),
                endDate: formatDate(data.originalEndDate, dateFormat, locale),
            };
            this.quotesMap[data.quoteType] = { ...data, index };
        });

        this.isMCP = this.quotesArray.some((quoteObject) => isOfferMCP(quoteObject.quote?.details[0]?.type));

        if (this.isStudentFlow) {
            const promoRenewalQuote = this.quotesMap['promoRenewalQuote'];
            const currentQuote = this.quotesMap['currentQuote'];
            if (promoRenewalQuote) {
                this.termLengthImportantNote = promoRenewalQuote.termLength;
            } else if (currentQuote) {
                this.termLengthImportantNote = currentQuote.termLength;
            }
            if (currentQuote) {
                this.endDateForNote = formatDate(currentQuote.originalEndDate, dateFormat, locale);
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

    viewToolTip(name): void {
        this._eventTrackService.track(this.trackViewToolTip, { componentName: this.trackComponentName, name: name });
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private isRoyaltyFee(description: string): boolean {
        return /Music[_\s]Royalty[_\s].*Fee$/.test(description);
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

        Object.entries(quote).forEach(([key, value], index) => {
            if (value !== null) {
                this.firstTotalAmount = this.firstTotalAmount === null ? value.totalAmount : this.firstTotalAmount;
                const details = value.details[0];
                const termString = this._i18nPluralPipe.transform(details.termLength, termLengthPluralMap);
                const termLength = this.translateParser.interpolate(termString, { termLength: details.termLength });
                const isMCP = isOfferMCP(details.type);
                const originalAmount = value.totalAmount ? value.totalAmount : this.firstTotalAmount;
                const originalStartDate = details.startDate;
                const originalEndDate = details.endDate;
                const quoteLoop = {
                    headlinePresent: this.quotesArray.length ? false : true,
                    quoteType: key,
                    quoteLangKey: this.parseQuoteKeyToTranslateKey(key),
                    quote: value,
                    originalAmount,
                    originalStartDate,
                    originalEndDate,
                    fees: value
                        ? value.fees.map((fee) => {
                              return {
                                  ...fee,
                                  isRoyaltyFee: this.isRoyaltyFee(fee.description),
                              };
                          })
                        : [],
                    QuoteTp: {
                        amount: this.parseCurrency(originalAmount),
                        isMrdEligible: value.details[0].isMrdEligible,
                        term: termLength,
                    },
                    isStudentQuote: details.isStudent,
                    hasBalance: +value.previousBalance > 0 ? true : false,
                    hasCredit: +value.previousBalance < 0 ? true : false,
                    isMCP,
                    termLength: details.termLength,
                };
                if (quoteLoop.hasOwnProperty('deal')) {
                    // makes it so the deal object (if it exists) only gets added to the first quote
                    dealAdded = true;
                }
                if (!(key === 'renewalQuote' && this.isStudentFlow)) {
                    this.quotesArray.push(quoteLoop);
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
