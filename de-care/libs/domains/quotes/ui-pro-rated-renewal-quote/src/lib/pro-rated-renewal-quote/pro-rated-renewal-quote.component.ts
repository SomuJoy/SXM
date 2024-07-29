import { I18nPluralPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import {
    ProRatedRenewalQuoteComponentViewModel,
    ProRatedRenewalQuoteInputViewModel,
    QuoteViewModel,
    isRoyaltyFee,
    isFreeUpgrade,
} from '@de-care/domains/quotes/state-quote-presentment';
import { TranslateService } from '@ngx-translate/core';
import { AccordionChevronInfo } from '@de-care/shared/sxm-ui/ui-accordion-chevron';

@Component({
    selector: 'order-summary-pro-rated-renewal-quote',
    templateUrl: './pro-rated-renewal-quote.component.html',
    styleUrls: ['./pro-rated-renewal-quote.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProRatedRenewalQuoteComponent implements OnInit {
    @Input() vm: ProRatedRenewalQuoteInputViewModel;

    item: ProRatedRenewalQuoteComponentViewModel;

    @Output() chevronClicked = new EventEmitter();
    @Output() viewToolTipClicked = new EventEmitter();

    translateKeyPrefix = 'DomainsQuotesUiProRatedRenewalQuoteModule.ProRatedRenewalQuoteComponent';
    math: Math;

    constructor(private readonly translateService: TranslateService, private readonly _i18nPluralPipe: I18nPluralPipe) {}

    ngOnChanges(): void {
        if (this.vm?.quoteVM) {
            this.item = this._processProRatedRenewalQuote(this.vm.quoteVM);
        }
    }

    ngOnInit(): void {}

    private _getProRatedRenewalQuoteTermandPriceText({ detailTermLength }) {
        return this._i18nPluralPipe.transform(detailTermLength, this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.MONTH_PLAN`));
    }

    private _getProratedRenewalQuoteHeading(showNonUpgradeHeadline: boolean, isProrated: boolean) {
        if (showNonUpgradeHeadline) {
            return { quoteHeading: 'quotes.orderSummaryComponent.PRORATED_RENEWAL_QUOTE.HEADER.NO_UPGRADE.BALANCE' };
        } else {
            if (isProrated) {
                return { quoteHeading: 'quotes.orderSummaryComponent.PRORATED_RENEWAL_QUOTE.HEADER.NO_UPGRADE.NON_BALANCE.PRORATED' };
            } else {
                return { quoteHeading: 'quotes.orderSummaryComponent.PRORATED_RENEWAL_QUOTE.HEADER.NO_UPGRADE.NON_BALANCE.NON_PRORATED' };
            }
        }
    }

    private _processProRatedRenewalQuote(quoteVM: QuoteViewModel): ProRatedRenewalQuoteComponentViewModel {
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
                    showFeesAndTaxes: +quoteVM.quote.totalTaxesAndFeesAmount >= 0,
                    shouldShowDetailsDropDown: +quoteVM.quote.totalTaxesAndFeesAmount !== 0,
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
                    ...this._getProratedRenewalQuoteHeading(showNonUpgradeHeadline, newQuote.quote.isProrated),
                    absCurrentBalance: Math.abs(+quoteVM.quote.currentBalance),
                },
                details: newQuote.quote.details.map((quoteDetail) => {
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

                    return {
                        ...quoteDetail,
                        displayProperties: {
                            showCredit,
                            hasBalance,
                            showPreviousBalance,
                            showPackageDescription,
                            shouldShowNoCurrentBalance: +quoteDetail.priceAmount >= 0,
                            shouldShowGiftCardQuote: quoteDetail.balanceType === 'GIFT_CARD',
                            shouldShowDetailsDropDown: quoteDetail.packageName && +newQuote.quote.totalTaxesAndFeesAmount !== 0,
                            termAndPriceText: this._getProRatedRenewalQuoteTermandPriceText({
                                detailTermLength: quoteDetail.termLength,
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
