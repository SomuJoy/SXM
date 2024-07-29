import { I18nPluralPipe, CurrencyPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { TranslateParser, TranslateService } from '@ngx-translate/core';
import { AccordionChevronInfo } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import {
    isRoyaltyFee,
    QuoteViewModel,
    RenewalQuoteComponentViewModel,
    RenewalQuoteInputViewModel,
    isFreeUpgrade,
    QuoteExtraData,
} from '@de-care/domains/quotes/state-quote-presentment';
import { Store } from '@ngrx/store';
import { getLanguage } from '@de-care/domains/customer/state-locale';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'order-summary-renewal-quote',
    templateUrl: './renewal-quote.component.html',
    styleUrls: ['./renewal-quote.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenewalQuoteComponent implements OnChanges {
    @Input() vm: RenewalQuoteInputViewModel;
    @Input() priceChangeMessagingType: string;
    @Input() priceChangeMessagingTypeFeatureFlag: boolean;

    item: RenewalQuoteComponentViewModel;
    language: string;

    @Output() chevronClicked = new EventEmitter();
    @Output() viewToolTipClicked = new EventEmitter();

    translateKeyPrefix = 'DomainsQuotesUiRenewalQuoteModule.RenewalQuoteComponent';
    math: Math;
    destroy$ = new BehaviorSubject(null);

    constructor(
        private readonly translateService: TranslateService,
        private readonly _translateParser: TranslateParser,
        private readonly _i18nPluralPipe: I18nPluralPipe,
        private readonly _currencyPipe: CurrencyPipe,
        private readonly _store: Store
    ) {}

    ngOnChanges(): void {
        if (this.vm?.quoteVM) {
            this.item = this._processRenewalQuote(this.vm.quoteVM);
            if (this.vm?.extraData?.isUpgradePkg) {
                this.item.headlinePresent = false;
            }
        }
    }

    ngOnInit(): void {
        this._listenForLang();
    }

    private _listenForLang() {
        this._store
            .select(getLanguage)
            .pipe(takeUntil(this.destroy$))
            .subscribe((lang) => {
                this.language = lang;
            });
    }

    private _getRenewalQuoteTermandPriceText({ detailIsMrdEligible, detailTermLength, displayDetailTermLength, isQuoteDetailPromo, showDiscount }) {
        if (showDiscount) {
            return this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.INCLUDES_DISCOUNT`);
        }

        if (detailIsMrdEligible) {
            return this._translateParser.interpolate(
                this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.MRD_ELEGIBLE`, {
                    monthlyExpression: this._i18nPluralPipe.transform(
                        detailTermLength,
                        this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.MONTH_PLAN`)
                    ),
                }),
                { termLength: detailTermLength }
            );
        }

        if (displayDetailTermLength || this.vm?.extraData?.isAcsc) {
            return this._translateParser.interpolate(
                this._i18nPluralPipe.transform(
                    detailTermLength,
                    this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.${isQuoteDetailPromo ? 'PROMO_PLAN' : 'MONTH_PLAN'}`)
                ),
                { termLength: detailTermLength }
            );
        } else {
            return this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_MONTH_PLAN`, { termLength: detailTermLength });
        }
    }

    private _getRenewalQuoteHeading(showNonUpgradeHeadline: boolean, quoteIsProrated: boolean, isStreamingFlow: boolean, extraData: QuoteExtraData) {
        if (extraData?.isPlatinumVIP) {
            return { quoteHeading: `${this.translateKeyPrefix}.RENEWAL_QUOTE.HEADER.PLATINUM_VIP.SINGULAR` };
        }
        if (extraData?.isUpgradePkg) {
            return { quoteHeading: `${this.translateKeyPrefix}.RENEWAL_QUOTE.HEADER.PKG_PACKAGE.SINGULAR` };
        }
        if (showNonUpgradeHeadline) {
            return { quoteHeading: 'quotes.orderSummaryComponent.RENEWAL_QUOTE.HEADER.NO_UPGRADE.BALANCE' };
        } else {
            if (quoteIsProrated) {
                return { quoteHeading: 'quotes.orderSummaryComponent.RENEWAL_QUOTE.HEADER.NO_UPGRADE.NON_BALANCE.PRORATED' };
            } else {
                if (isStreamingFlow) {
                    return { quoteHeading: 'quotes.orderSummaryComponent.RENEWAL_QUOTE.HEADER.NO_UPGRADE.NON_BALANCE.NON_PRORATED' };
                } else {
                    return { quoteHeading: 'quotes.orderSummaryComponent.RENEWAL_QUOTE.HEADER.NO_UPGRADE.NON_BALANCE.NON_PRORATED_WITH_CANCEL' };
                }
            }
        }
    }

    private _processRenewalQuote(quoteVM: QuoteViewModel): RenewalQuoteComponentViewModel {
        const newQuote = { ...quoteVM };
        const { index } = newQuote;
        const showNonUpgradeHeadline = newQuote.hasBalance || newQuote.quote.isUpgraded;
        const shouldShowUpgradeFees = !!quoteVM.quote.packageUpgradeFees && quoteVM.quote.packageUpgradeFees.length > 0;
        return {
            ...quoteVM,
            quote: {
                ...quoteVM.quote,
                displayProperties: {
                    showNonUpgradeHeadline,
                    showCancelTexForStreaming: this.vm.isStreamingFlow && this.vm.leadOfferHasEtfAmount,
                    shouldShowQuoteHeading: !this.vm.isStudentFlow,
                    headerClass: index === 0 ? '' : 'recurring-charge-copy',
                    shouldShowMainAccordion: index !== 0,
                    shouldShowUpgradeFees,
                    isOpened:
                        !this.vm.quoteVM.quote['collapsed'] &&
                        (this.vm.isCanada ||
                            this.vm.expandOrderSummaryDetails ||
                            (index === 1 && (!this.vm.isMCP || this.vm.isCurrentSubscriptionTrial)) ||
                            (this.vm.isMCP && index === 2)),
                    isFooterPresent: +newQuote.quote.currentBalance < 0,
                    showFeesAndTaxes: +quoteVM.quote.totalTaxesAndFeesAmount >= 0,
                    shouldShowDetailsDropDown: +quoteVM.quote.totalTaxesAndFeesAmount !== 0,
                    absCurrentBalance: Math.abs(+quoteVM.quote.currentBalance),
                    ...this._getRenewalQuoteHeading(showNonUpgradeHeadline, newQuote.quote.isProrated, this.vm.isStreamingFlow, this.vm.extraData),
                },
                details: quoteVM.quote.details.map((quoteDetail: any) => {
                    const hasBalance = quoteDetail.balanceType === 'PREVIOUS_BALANCE' || quoteDetail.balanceType === 'CREDIT_REMAINING_ON_ACCOUNT';
                    const hasCredit = quoteDetail.balanceType === 'CREDIT_REMAINING_ON_ACCOUNT';
                    const showCredit = quoteVM.hasCredit && hasCredit;
                    const showPackageDescription = !!quoteDetail.packageName && !hasCredit;
                    const showPreviousBalance =
                        quoteDetail.balanceType === 'PREVIOUS_BALANCE' &&
                        !hasCredit &&
                        +quoteDetail.priceAmount > 0 &&
                        quoteVM.quote.details.every((detail) => detail.balanceType !== 'CREDIT_REMAINING_ON_ACCOUNT') &&
                        Math.abs(+quoteVM.quote.previousBalance) > 0;

                    const isQuoteDetailPromo = quoteDetail.type === 'PROMO';

                    return {
                        ...quoteDetail,
                        displayProperties: {
                            hasBalance: quoteDetail.balanceType === 'PREVIOUS_BALANCE' || quoteDetail.balanceType === 'CREDIT_REMAINING_ON_ACCOUNT',
                            showCredit,
                            showPackageDescription,
                            shouldShowNoCurrentBalance: +quoteDetail.priceAmount >= 0,
                            shouldShowGiftCardQuote: quoteDetail.balanceType === 'GIFT_CARD',
                            detailsTermLength: quoteDetail.termLength === 1 || quoteDetail.termLength === 12,
                            showPreviousBalance,
                            shouldShowDetailsDropDown: quoteDetail.packageName && +newQuote.quote.totalTaxesAndFeesAmount !== 0,
                            termAndPriceText: this._getRenewalQuoteTermandPriceText({
                                detailIsMrdEligible: quoteDetail.isMrdEligible,
                                detailTermLength: quoteDetail.termLength,
                                displayDetailTermLength: quoteDetail.termLength === 1 || quoteDetail.termLength === 12,
                                isQuoteDetailPromo,
                                showDiscount: quoteDetail.isMilitary,
                            }),
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
