import { CurrencyPipe, I18nPluralPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';
import { TranslateParser, TranslateService } from '@ngx-translate/core';
import { AccordionChevronInfo } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { FutureQuoteInputViewModel, FutureQuoteComponentViewModel, QuoteViewModel, isRoyaltyFee, isFreeUpgrade } from '@de-care/domains/quotes/state-quote-presentment';

@Component({
    selector: 'order-summary-future-quote',
    templateUrl: './future-quote.component.html',
    styleUrls: ['./future-quote.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FutureQuoteComponent implements OnInit {
    @Input() vm: FutureQuoteInputViewModel;
    @Input() priceChangeMessagingType: string;
    @Input() priceChangeMessagingTypeFeatureFlag: boolean;

    math = Math;
    item: FutureQuoteComponentViewModel;

    @Output() chevronClicked = new EventEmitter();
    @Output() viewToolTipClicked = new EventEmitter();

    translateKeyPrefix = 'DomainsQuotesUiFutureQuoteModule.FutureQuoteComponent';

    constructor(
        private readonly translateService: TranslateService,
        private readonly _translateParser: TranslateParser,
        private readonly _i18nPluralPipe: I18nPluralPipe,
        private readonly _currencyPipe: CurrencyPipe
    ) {}

    ngOnChanges(): void {
        if (this.vm?.quoteVM) {
            this.item = this._processFutureQuote(this.vm.quoteVM);
        }
    }

    ngOnInit(): void {}

    private _getFutureQuoteTermandPriceText({
        detailIsMrdEligible,
        detailTermLength,
        detailIsNotProrated,
        displayPrice,
        itemTermLength,
        isCanadaAndMCP,
        isAdvantage,
        currentLang,
        isIntroductory,
        isQuoteDetailPromo,
        shouldShowMCPAndTheLikes,
        showDiscount,
    }) {
        if (showDiscount) {
            return this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.INCLUDES_DISCOUNT`);
        }
        const isLongTermPlan = this.vm?.quoteVM?.quote?.details[0]?.type === 'LONG_TERM';
        const priceAmount = this.vm?.quoteVM?.quote?.details[0]?.priceAmount;

        const pluralMap = detailIsMrdEligible
            ? this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.MONTH_PLAN`)
            : isLongTermPlan
            ? this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.YEARS`)
            : this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.MONTHS`);

        if (detailIsMrdEligible) {
            return this._translateParser.interpolate(
                this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.MRD_ELEGIBLE`, {
                    monthlyExpression: this._i18nPluralPipe.transform(detailTermLength, pluralMap),
                }),
                { termLength: detailTermLength }
            );
        }

        const price = isLongTermPlan
            ? this._currencyPipe.transform(priceAmount, 'USD', 'symbol-narrow', undefined, currentLang)
            : this._currencyPipe.transform(displayPrice, 'USD', 'symbol-narrow', undefined, currentLang);

        const planTerm = isLongTermPlan ? parseInt((detailTermLength / 12).toFixed(0), 10) : detailTermLength;
        const pluralizedMonth = this._i18nPluralPipe.transform(planTerm, pluralMap);

        if ((shouldShowMCPAndTheLikes && detailIsNotProrated && !isIntroductory && !isAdvantage && !this.vm.extraData?.isAcsc) || this._quoteTypeIsRtcOffer()) {
            return this.translateService.instant(
                isCanadaAndMCP ? `${this.translateKeyPrefix}.ORDER_DETAILS.MONTHS_FOR_MCP` : `${this.translateKeyPrefix}.ORDER_DETAILS.MONTHS_FOR`,
                {
                    length: planTerm,
                    pluralizedMonth,
                    price,
                }
            );
        } else {
            if (isLongTermPlan) {
                return this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_FOR`, {
                    length: planTerm,
                    pluralizedMonth,
                    price,
                });
            }
            return this._translateParser.interpolate(
                this._i18nPluralPipe.transform(
                    itemTermLength,
                    this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.${isQuoteDetailPromo ? 'PROMO_PLAN' : 'MONTH_PLAN'}`)
                ),
                { termLength: itemTermLength }
            );
        }
    }

    private _getquoteHeading(hasBalance: boolean, quoteIsProrated: boolean, isClosedRadio: boolean, planType: string) {
        if (hasBalance) {
            if (quoteIsProrated) {
                return { quoteHeading: 'quotes.orderSummaryComponent.FUTURE_QUOTE.HEADER.NO_UPGRADE.BALANCE.PRORATED' };
            } else {
                return { quoteHeading: 'quotes.orderSummaryComponent.FUTURE_QUOTE.HEADER.NO_UPGRADE.BALANCE.NON_PRORATED' };
            }
        } else {
            if (quoteIsProrated) {
                if (isClosedRadio) {
                    return { quoteHeading: 'quotes.orderSummaryComponent.FUTURE_QUOTE.HEADER.NO_UPGRADE.NON_BALANCE.PRORATED.CLOSED' };
                } else {
                    return { quoteHeading: 'quotes.orderSummaryComponent.FUTURE_QUOTE.HEADER.NO_UPGRADE.NON_BALANCE.PRORATED.TRIAL' };
                }
            } else if (planType === 'SELF_PAY' || planType === 'INTRODUCTORY') {
                return { quoteHeading: 'quotes.orderSummaryComponent.FUTURE_QUOTE.HEADER.NO_UPGRADE.NON_BALANCE.NON_PRORATED_FULL_PRICE' };
            } else {
                return { quoteHeading: 'quotes.orderSummaryComponent.FUTURE_QUOTE.HEADER.NO_UPGRADE.NON_BALANCE.NON_PRORATED' };
            }
        }
    }

    private _processFutureQuote(quoteVM: QuoteViewModel): FutureQuoteComponentViewModel {
        const newQuote = { ...quoteVM };
        const { index } = newQuote;
        const shouldShowUpgradeFees = !!quoteVM.quote.packageUpgradeFees && quoteVM.quote.packageUpgradeFees.length > 0;

        return {
            ...quoteVM,
            quote: {
                ...quoteVM.quote,
                displayProperties: {
                    shouldShowQuoteHeading: !this.vm.isStudentFlow,
                    headerClass: index === 0 ? '' : 'recurring-charge-copy',
                    shouldShowMainAccordion: index !== 0,
                    shouldShowUpgradeFees,
                    isOpened:
                        this.vm.isCanada ||
                        this.vm.expandOrderSummaryDetails ||
                        (index === 1 && (!this.vm.isMCP || this.vm.isCurrentSubscriptionTrial)) ||
                        (this.vm.isMCP && index === 2),
                    isFooterPresent: +newQuote.quote.currentBalance < 0,
                    ...this._getquoteHeading(newQuote.hasBalance, newQuote.quote.isProrated, this.vm.isClosedRadio, quoteVM.quote.details[0].type),
                    absCurrentBalance: Math.abs(+quoteVM.quote.currentBalance),
                    showFeesAndTaxes: +quoteVM.quote.totalTaxesAndFeesAmount >= 0,
                    shouldShowDetailsDropDown: +quoteVM.quote.totalTaxesAndFeesAmount !== 0,
                },
                details: quoteVM.quote.details.map((quoteDetail) => {
                    const isEligibleAndProrated = quoteDetail.isMrdEligible && newQuote?.quote?.isProrated && this.vm.isCanada;
                    const isNotProrated = !newQuote.quote.isProrated;
                    const price = this.vm.isCanada ? quoteDetail.priceAmount : newQuote.quote.pricePerMonth;
                    const isCanadaAndMCP = this.vm.isCanada && newQuote.isMCP;
                    const hasBalance = quoteDetail.balanceType === 'PREVIOUS_BALANCE' || quoteDetail.balanceType === 'CREDIT_REMAINING_ON_ACCOUNT';
                    const hasCredit = quoteDetail.balanceType === 'CREDIT_REMAINING_ON_ACCOUNT';
                    const showCredit = quoteVM.hasCredit && hasCredit;
                    const showPreviousBalance =
                        quoteDetail.balanceType === 'PREVIOUS_BALANCE' &&
                        !hasCredit &&
                        +quoteDetail.priceAmount > 0 &&
                        quoteVM.quote.details.every((detail) => detail.balanceType !== 'CREDIT_REMAINING_ON_ACCOUNT') &&
                        Math.abs(+quoteVM.quote.previousBalance) > 0;
                    const showPackageDescription = !!quoteDetail.packageName && !hasCredit;
                    const isIntroductory = quoteDetail.type === 'INTRODUCTORY';
                    const isQuoteDetailPromo = quoteDetail.type === 'PROMO';
                    const shouldShowMCPAndTheLikes =
                        quoteDetail.type?.indexOf('PROMO') !== -1 ||
                        quoteDetail.type?.indexOf('TRIAL') !== -1 ||
                        (!quoteVM.quote.isProrated &&
                            (this.vm.isClosedStreaming ||
                                this.vm.isClosedRadio ||
                                this.vm.isNewAccount ||
                                this.vm.quoteVM.isStudentQuote ||
                                (this.vm.isChangeSubscription && quoteDetail.type !== 'SELF_PAY' && quoteDetail.type !== 'INTRODUCTORY')));

                    return {
                        ...quoteDetail,
                        displayProperties: {
                            hasBalance,
                            showCredit,
                            showPackageDescription,
                            shouldShowNoCurrentBalance: +quoteDetail.priceAmount >= 0,
                            shouldShowGiftCardQuote: quoteDetail.balanceType === 'GIFT_CARD',
                            showPreviousBalance,
                            shouldNotBoldPackageName: quoteDetail['shouldNotBoldPackageName'] === true,
                            noDetailPackageName: !quoteDetail.packageName,
                            shouldShowDetailsDropDown: quoteDetail.packageName && +newQuote.quote.totalTaxesAndFeesAmount !== 0,
                            isEligibleAndProrated,
                            isNotProrated,
                            isCanadaAndMCP,
                            price,
                            termAndPriceSubText: quoteDetail['priceAndTermSubText'],
                            termAndPriceText: this._getFutureQuoteTermandPriceText({
                                detailIsMrdEligible: quoteDetail.isMrdEligible,
                                detailTermLength: quoteDetail.termLength,
                                detailIsNotProrated: isNotProrated,
                                displayPrice: price,
                                itemTermLength: quoteVM.termLength,
                                isCanadaAndMCP,
                                isAdvantage: quoteDetail.isAdvantage,
                                currentLang: this.vm.currentLang,
                                isIntroductory,
                                isQuoteDetailPromo,
                                shouldShowMCPAndTheLikes,
                                showDiscount: quoteDetail.isMilitary,
                            }),
                            shouldShowDetailTermAndPrice:
                                quoteDetail['shouldShowDetailTermAndPrice'] !== false && (quoteDetail.termLength <= 6 || quoteDetail.termLength >= 12),
                        },
                    };
                }),
                fees: quoteVM.quote.fees.map((fee) => {
                    return {
                        ...fee,
                        displayProperties: {
                            isRoyaltyFee: isRoyaltyFee(fee.description),
                        },
                    };
                }),
                upgradeFees: !shouldShowUpgradeFees
                    ? null
                    : quoteVM.quote.packageUpgradeFees.map((upgrade) => {
                          return {
                              description: upgrade.planCode,
                              amount: upgrade.feeAmount,
                              packageName: upgrade.packageName,
                              termLength: upgrade.termLength,
                              displayProperties: {
                                  isFreeUpgrade: isFreeUpgrade(upgrade.planCode, upgrade.feeAmount),
                              },
                          };
                      }),
            },
        };
    }

    viewDetails($event: AccordionChevronInfo, quoteType: string, quoteInsideContentContainer: boolean, isProrated: boolean) {
        this.chevronClicked.emit({ $event, quoteType, quoteInsideContentContainer, isProrated });
    }

    viewToolTip(name: string) {
        this.viewToolTipClicked.emit(name);
    }

    // TODO: Cheking if offer type is RTC_OFFER to display the future quote description in the correct format.
    // This function is making the assumption that quote returns type RTC_OFFER for 3FOR1AARTC and this type is not used in other flows,
    // or expect the same behavior. This condition needs to be reviewed. Temporary solution.
    private _quoteTypeIsRtcOffer(): boolean {
        const details = this.vm?.quoteVM?.quote?.details;
        return details && Array.isArray(details) && details.length > 0 && details[0].type === 'RTC_OFFER';
    }
}
