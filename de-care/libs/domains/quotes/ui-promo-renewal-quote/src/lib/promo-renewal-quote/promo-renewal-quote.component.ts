import { CurrencyPipe, I18nPluralPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccordionChevronInfo } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import {
    isRoyaltyFee,
    PromoRenewalQuoteComponentViewModel,
    PromoRenewalQuoteInputViewModel,
    QuoteViewModel,
    isFreeUpgrade,
} from '@de-care/domains/quotes/state-quote-presentment';

@Component({
    selector: 'order-summary-promo-renewal-quote',
    templateUrl: './promo-renewal-quote.component.html',
    styleUrls: ['./promo-renewal-quote.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoRenewalQuoteComponent implements OnInit {
    @Input() vm: PromoRenewalQuoteInputViewModel;
    item: PromoRenewalQuoteComponentViewModel;

    @Output() chevronClicked = new EventEmitter();
    @Output() viewToolTipClicked = new EventEmitter();

    translateKeyPrefix = 'DomainsQuotesUiPromoRenewalQuoteModule.PromoRenewalQuoteComponent';
    math = Math;
    royaltyFee;

    constructor(private readonly translateService: TranslateService, private readonly _i18nPluralPipe: I18nPluralPipe, private readonly _currencyPipe: CurrencyPipe) {}

    ngOnChanges(): void {
        if (this.vm?.quoteVM) {
            this.item = this._processPromoRenewalQuote(this.vm.quoteVM);
            if (this.vm?.extraData?.isUpgradePkg) {
                this.item.headlinePresent = false;
            }
        }
    }

    ngOnInit(): void {}

    private _getPromoRenewalQuoteTermandPriceText({ detailNotProrated, detailTermLength, showCorrectOrderDetail, itemTermLength, priceAmount, currentLang, isUpgrade }) {
        if (detailNotProrated) {
            const pluralMap = this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.MONTHS`);
            const pluralizedMonth = this._i18nPluralPipe.transform(itemTermLength, pluralMap);
            const price = this._currencyPipe.transform(priceAmount, 'USD', 'symbol-narrow', undefined, currentLang);

            if (this.vm.extraData?.isUpgradePkg) {
                if (isUpgrade) {
                    return this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.THREE_MONTH_UPGRADE`);
                } else {
                    return this._i18nPluralPipe.transform(
                        detailTermLength,
                        this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.MONTH_PLAN`)
                    );
                }
            } else {
                return this.translateService.instant(
                    showCorrectOrderDetail ? `${this.translateKeyPrefix}.ORDER_DETAILS.MONTHS_FOR_MCP` : `${this.translateKeyPrefix}.ORDER_DETAILS.MONTHS_FOR`,
                    {
                        length: detailTermLength,
                        pluralizedMonth,
                        price,
                    }
                );
            }
        } else {
            return this._i18nPluralPipe.transform(
                detailTermLength,
                this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.MONTH_PLAN`)
            );
        }
    }

    private _getPromoRenewalQuoteHeading(isMCP: boolean, hasBalance: boolean, isProrated: boolean) {
        if (isMCP) {
            if (hasBalance) {
                if (isProrated) {
                    return { quoteHeading: 'quotes.orderSummaryComponent.PROMO_RENEWAL_QUOTE.HEADER.NO_UPGRADE.MCP.BALANCE.PRORATED' };
                } else {
                    return { quoteHeading: 'quotes.orderSummaryComponent.PROMO_RENEWAL_QUOTE.HEADER.NO_UPGRADE.MCP.BALANCE.NON_PRORATED' };
                }
            } else {
                return { quoteHeading: 'quotes.orderSummaryComponent.PROMO_RENEWAL_QUOTE.HEADER.NO_UPGRADE.MCP.NON_BALANCE' };
            }
        } else {
            if (hasBalance) {
                if (isProrated) {
                    return { quoteHeading: 'quotes.orderSummaryComponent.PROMO_RENEWAL_QUOTE.HEADER.NO_UPGRADE.NON_MCP.BALANCE.PRORATED' };
                } else {
                    return { quoteHeading: 'quotes.orderSummaryComponent.PROMO_RENEWAL_QUOTE.HEADER.NO_UPGRADE.NON_MCP.BALANCE.NON_PRORATED' };
                }
            } else {
                return { quoteHeading: 'quotes.orderSummaryComponent.PROMO_RENEWAL_QUOTE.HEADER.NO_UPGRADE.NON_MCP.NON_BALANCE' };
            }
        }
    }

    private _processPromoRenewalQuote(quoteVM: QuoteViewModel): PromoRenewalQuoteComponentViewModel {
        const newQuote = { ...quoteVM };
        const { index } = newQuote;
        const shouldShowUpgradeFees = !!quoteVM.quote.packageUpgradeFees && quoteVM.quote.packageUpgradeFees.length > 0;

        return {
            ...quoteVM,
            quote: {
                ...quoteVM.quote,
                displayProperties: {
                    shouldShowQuoteHeading: !this.vm.quoteVM.isStudentQuote,
                    headerClass: index === 0 ? '' : 'recurring-charge-copy',
                    shouldShowMainAccordion: index !== 0 && quoteVM.quote['displayInAccordion'] !== false,
                    isOpened:
                        this.vm.isCanada ||
                        this.vm.expandOrderSummaryDetails ||
                        (index === 1 && (!this.vm.isMCP || this.vm.isCurrentSubscriptionTrial)) ||
                        (this.vm.isMCP && index === 2),
                    isFooterPresent: +newQuote.quote.currentBalance < 0,
                    absCurrentBalance: Math.abs(+quoteVM.quote.currentBalance),
                    ...this._getPromoRenewalQuoteHeading(newQuote.isMCP, newQuote.hasBalance, newQuote.quote.isProrated),
                    shouldShowDetailsDropDown: +quoteVM.quote.totalTaxesAndFeesAmount !== 0,
                    showFeesAndTaxes: +quoteVM.quote.totalTaxesAndFeesAmount >= 0,
                    shouldShowUpgradeFees,
                    ...this._getPromoRenewalQuoteHeading(newQuote.isMCP, newQuote.hasBalance, newQuote.quote.isProrated),
                },
                details: quoteVM.quote.details.map((quoteDetail) => {
                    const price = this.vm.isCanada ? quoteDetail.priceAmount : newQuote.quote.pricePerMonth;
                    const showCorrectOrderDetail = this.vm.isCanada && (newQuote.isMCP || this.vm.quoteVM.isStudentQuote);
                    const notProrated = !newQuote.quote.isProrated;

                    const hasBalance = quoteDetail.balanceType === 'PREVIOUS_BALANCE' || quoteDetail.balanceType === 'CREDIT_REMAINING_ON_ACCOUNT';
                    const hasCredit = quoteDetail.balanceType === 'CREDIT_REMAINING_ON_ACCOUNT';
                    const showCredit = quoteVM.hasCredit && hasCredit;
                    const showPackageDescription = !!quoteDetail.packageName && !hasCredit;
                    const isUpgrade = quoteDetail.type === 'UPGRADE';
                    const showPreviousBalance =
                        quoteDetail.balanceType === 'PREVIOUS_BALANCE' &&
                        !hasCredit &&
                        +quoteDetail.priceAmount > 0 &&
                        quoteVM.quote.details.every((detail) => detail.balanceType !== 'CREDIT_REMAINING_ON_ACCOUNT') &&
                        Math.abs(+quoteVM.quote.previousBalance) > 0;
                    const isMegaLiteAppleMusic = shouldShowUpgradeFees && quoteDetail.dealType === 'APPLE';

                    return {
                        ...quoteDetail,
                        displayProperties: {
                            hasBalance: quoteDetail.balanceType === 'PREVIOUS_BALANCE' || quoteDetail.balanceType === 'CREDIT_REMAINING_ON_ACCOUNT',
                            shouldShowNoCurrentBalance: +quoteDetail.priceAmount >= 0,
                            notProrated,
                            showPackageDescription,
                            showCorrectOrderDetail,
                            price,
                            shouldShowAppleMusicFree: isMegaLiteAppleMusic,
                            shouldShowDetailDealType: !!quoteDetail.dealType && !isMegaLiteAppleMusic,
                            termAndPriceText: this._getPromoRenewalQuoteTermandPriceText({
                                detailNotProrated: notProrated,
                                detailTermLength: quoteDetail.termLength,
                                showCorrectOrderDetail,
                                itemTermLength: quoteVM.termLength,
                                priceAmount: price,
                                currentLang: this.vm.currentLang,
                                isUpgrade: isUpgrade,
                            }),
                            showPreviousBalance,
                            showCredit,
                            shouldShowGiftCardQuote: false,
                        },
                    };
                }),
                fees: newQuote.quote.fees.map((fee) => {
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
}
