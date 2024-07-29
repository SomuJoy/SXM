import { CurrencyPipe, I18nPluralPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TranslateService, TranslateParser } from '@ngx-translate/core';
import { AccordionChevronInfo } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { Detail } from '@de-care/domains/quotes/state-quote';
import { CurrentQuoteInputViewModel, CurrentQuoteComponentViewModel, QuoteViewModel, isRoyaltyFee, isFreeUpgrade } from '@de-care/domains/quotes/state-quote-presentment';

@Component({
    selector: 'order-summary-current-quote',
    templateUrl: './current-quote.component.html',
    styleUrls: ['./current-quote.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentQuoteComponent implements OnChanges {
    @Input() vm: CurrentQuoteInputViewModel;
    @Input() headlinePresent: boolean;

    item: CurrentQuoteComponentViewModel;

    @Output() chevronClicked = new EventEmitter();
    @Output() viewToolTipClicked = new EventEmitter();

    translateKeyPrefix = 'DomainsQuotesUiCurrentQuoteModule.CurrentQuoteComponent';

    constructor(
        private readonly translateService: TranslateService,
        private readonly _i18nPluralPipe: I18nPluralPipe,
        private readonly _currencyPipe: CurrencyPipe,
        private _translateParser: TranslateParser
    ) {}

    ngOnChanges(): void {
        if (this.vm?.quoteVM) {
            this.item = this._processCurrentQuote(this.vm.quoteVM);
            if (this.headlinePresent !== undefined) {
                this.item.headlinePresent = this.headlinePresent;
            }
        }
    }

    private _getCurrentQuoteTermandPriceText({
        detailTermLength,
        detailIsMrdEligible,
        showUpgradeFee,
        shouldShowMCPAndTheLikes,
        showMCP,
        termLength,
        isCanada,
        isAdvantage,
        priceAmount,
        pricePerMonth,
        currentLang,
        type,
        showDiscount,
    }): string {
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

        if (type === 'SELF_PAY') {
            return this._translateParser.interpolate(
                this._i18nPluralPipe.transform(termLength, this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.MONTH_PLAN`)),
                { termLength: termLength }
            );
        }

        if (showUpgradeFee) {
            return this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TRIAL_UPGRADE_FEE`);
        }
        const isLongTermPlan = this.vm?.quoteVM?.quote?.details[0]?.type === 'LONG_TERM';
        const isCanadaNonMCP = this.vm.isCanada && !this.vm?.quoteVM?.isMCP;
        const shouldShowFullTermPrice = isLongTermPlan || isCanadaNonMCP;

        const price = shouldShowFullTermPrice
            ? this._currencyPipe.transform(priceAmount, 'USD', 'symbol-narrow', undefined, currentLang)
            : this._currencyPipe.transform(pricePerMonth, 'USD', 'symbol-narrow', undefined, currentLang);

        if (!isAdvantage && shouldShowMCPAndTheLikes) {
            const planTerm = isLongTermPlan ? parseInt((termLength / 12).toFixed(0), 10) : termLength;
            const pluralMap = isLongTermPlan
                ? this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.YEARS`)
                : this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.MONTHS`);
            const pluralizedMonth = this._i18nPluralPipe.transform(planTerm, pluralMap);

            if (shouldShowFullTermPrice) {
                return this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_FOR`, {
                    length: planTerm,
                    pluralizedMonth,
                    price,
                });
            }

            return this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.MONTHS_FOR`, {
                length: planTerm,
                pluralizedMonth,
                price,
            });
        } else {
            const pluralMap = this.translateService.instant(`${this.translateKeyPrefix}.ORDER_DETAILS.TERM_LENGTH.PLURAL_MAP.MONTH_PLAN`);
            const monthsExpression = this._i18nPluralPipe.transform(termLength, pluralMap);
            return monthsExpression;
        }
    }

    private _getCurrentQuoteHeading(shouldShowCurrentQuoteHeading, notClosedorNew, isUpgraded, showPromoPlan, isTrialEnhancement: boolean) {
        if (shouldShowCurrentQuoteHeading && notClosedorNew) {
            // TODO: trial enhancement temporary solution, should be removed after MS solution is implemented
            if (isTrialEnhancement) {
                return { quoteHeading: `${this.translateKeyPrefix}.CURRENT_QUOTE.HEADER.TRIAL_ENHANCEMENT` };
            } else if (isUpgraded) {
                return { quoteHeading: 'quotes.orderSummaryComponent.CURRENT_QUOTE.HEADER.ALL_ACCESS' };
            } else if (showPromoPlan) {
                return { quoteHeading: 'quotes.orderSummaryComponent.CURRENT_QUOTE.HEADER.PROMO_PLAN' };
            }
        }
    }

    private _getCurrentQuoteBalance(shouldShowCurrentBalance, currentBalance, quoteCurrentBalance, quoteTotalAmount) {
        if (shouldShowCurrentBalance) {
            switch (currentBalance) {
                case -1:
                    return { balance: 0.0, balanceFormat: '1.2-2' };
                case 0:
                    return { balance: 0.0, balanceFormat: '1.2-2' };
                case 1:
                    return { balance: quoteCurrentBalance, balanceFormat: undefined };
            }
        } else {
            return { balance: quoteTotalAmount, balanceFormat: undefined };
        }
    }

    private _processCurrentQuote(quoteVM: QuoteViewModel): CurrentQuoteComponentViewModel {
        const { index } = quoteVM;

        const shouldShowCurrentQuoteHeading = +quoteVM.quote.currentBalance > 0;
        const notClosedorNew = !(this.vm.isClosedRadio || this.vm.isNewAccount);
        const showPromoPlan =
            this.vm.isChangeSubscription && this.vm.isCurrentSubscriptionTrial && quoteVM.quote.totalAmount.toString() !== '0.00' && !this.vm.isClosedStreaming;
        const shouldShowCurrentBalance = !!quoteVM.quote.currentBalance;
        const currentBalance = Math.sign(+quoteVM.quote.currentBalance);
        const showMCP = this.vm.isCanada && quoteVM.isMCP;
        const shouldShowUpgradeFees = !!quoteVM.quote.packageUpgradeFees && quoteVM.quote.packageUpgradeFees.length > 0;

        return {
            ...quoteVM,
            quote: {
                ...quoteVM.quote,
                displayProperties: {
                    shouldShowQuoteHeading: shouldShowCurrentQuoteHeading,
                    endDateForNote: quoteVM.endDateForNote,
                    headerClass: index === 0 ? '' : 'recurring-charge-copy',
                    showTotalAsPaid: this.vm?.extraData?.showTotalAsPaid,
                    shouldShowMainAccordion: index !== 0,
                    notClosedorNew,
                    showPromoPlan,
                    isOpened:
                        this.vm.isCanada ||
                        this.vm.expandOrderSummaryDetails ||
                        (index === 1 && (!this.vm.isMCP || this.vm.isCurrentSubscriptionTrial)) ||
                        (this.vm.isMCP && index === 2),
                    isFooterPresent: +quoteVM.quote.currentBalance < 0,
                    showMCP,
                    shouldShowUpgradeFees,
                    showUnusedCredit: this.vm.showUnusedCreditLine && quoteVM.quote.consolidatedCreditAmount,
                    shouldShowCurrentBalance,
                    currentBalance,
                    showQuoteCredit: +quoteVM.quote.currentBalance < 0,
                    showGSTAndQST: this.vm.isCanada,
                    showStudentContainer: this.vm.quoteVM.isStudentQuote,
                    isStudentRTPOffer: this.vm.quoteVM.isStudentQuote && quoteVM.quote.details[0].type === 'RTP_OFFER',
                    showHeadlineSeeOfferDetails: this.vm.showHeadlineSeeOfferDetails,

                    ...(!this.vm?.extraData?.isPlatinumVIP &&
                        this._getCurrentQuoteHeading(shouldShowCurrentQuoteHeading, notClosedorNew, quoteVM.quote.isUpgraded, showPromoPlan, this._checkIsTrialEnhancement())),
                    ...this._getCurrentQuoteBalance(shouldShowCurrentBalance, currentBalance, quoteVM.quote.currentBalance, quoteVM.quote.totalAmount),
                    absCurrentBalance: Math.abs(+quoteVM.quote.currentBalance),
                    showFeesAndTaxes: +quoteVM.quote.totalTaxesAndFeesAmount >= 0,
                    isDetailDropDownOpened: this.vm.isCanada,
                    shouldShowDetailsDropDown: +quoteVM.quote.totalTaxesAndFeesAmount !== 0,
                },

                details: quoteVM.quote.details.map((quoteDetail: Detail) => {
                    const showUpgradeFee = !(
                        this.vm.isClosedRadio ||
                        this.vm.isNewAccount ||
                        this.vm.isStreamingFlow ||
                        this.vm.isChangeSubscription ||
                        this.vm.isDataOnlyTrial
                    );
                    // TODO: The flag isProrated requires some investigation. Purpose of this flag is not completely clear
                    const shouldShowMCPAndTheLikes =
                        quoteDetail.type === 'PROMO_MCP' ||
                        ((!quoteVM.quote.isProrated || quoteDetail.type !== 'SELF_PAY') &&
                            (this.vm.isClosedStreaming ||
                                this.vm.isClosedRadio ||
                                this.vm.isNewAccount ||
                                this.vm.quoteVM.isStudentQuote ||
                                (this.vm.isChangeSubscription && quoteDetail.type !== 'SELF_PAY' && quoteDetail.type !== 'INTRODUCTORY')));

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
                    const isMegaLiteAppleMusic = shouldShowUpgradeFees && quoteDetail.dealType === 'APPLE';
                    const isPackageAmzDot = quoteDetail.packageName === 'AMZ_DOT';
                    return {
                        ...quoteDetail,
                        displayProperties: {
                            hasBalance,
                            showUpgradeFee,
                            showPreviousBalance,
                            shouldShowMCPAndTheLikes,
                            showPackageDescription,
                            shouldShowNoCurrentBalance: +quoteDetail.priceAmount >= 0,
                            showCredit,
                            shouldShowGiftCardQuote: quoteDetail.balanceType === 'GIFT_CARD',
                            shouldShowDetailPackageName: quoteDetail.packageName,
                            shouldShowDetailDealType: !!quoteDetail.dealType && !isMegaLiteAppleMusic && !['AMZ_DOT', 'JBL'].includes(quoteDetail.dealType),
                            shouldShowDetailDealTypeDetails: quoteDetail.dealType === 'HULU',
                            shouldNotBoldPackageName: quoteDetail.packageName === 'DISCOVERY_PLUS' || isPackageAmzDot,
                            noDetailPackageName: !quoteDetail.packageName,
                            shouldShowDetailsDropDown: !hasBalance && +quoteVM.quote.totalTaxesAndFeesAmount !== 0,
                            shouldShowAppleMusicFree: isMegaLiteAppleMusic,
                            termAndPriceSubText: quoteDetail['priceAndTermSubText'],
                            termAndPriceText: this._getCurrentQuoteTermandPriceText({
                                showUpgradeFee,
                                shouldShowMCPAndTheLikes,
                                showMCP,
                                termLength: quoteDetail.packageName === 'DISCOVERY_PLUS' ? quoteDetail.termLength : quoteVM.termLength,
                                isCanada: this.vm.isCanada,
                                isAdvantage: quoteDetail.isAdvantage,
                                priceAmount: quoteDetail.priceAmount,
                                pricePerMonth: quoteVM.quote.pricePerMonth,
                                currentLang: this.vm.currentLang,
                                detailIsMrdEligible: quoteDetail.isMrdEligible,
                                detailTermLength: quoteDetail.termLength,
                                type: quoteDetail.type,
                                showDiscount: quoteDetail.isMilitary,
                            }),
                            shouldShowDetailTermAndPrice: quoteDetail.termLength != -1 && (quoteDetail.termLength <= 6 || quoteDetail.termLength >= 12),
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

    private _checkIsTrialEnhancement() {
        return this.vm.isCurrentSubscriptionTrial && new Date(this.vm.currentSubscriptionEndDate) > new Date(this.vm.quoteVM.quote?.details[0]?.startDate);
    }
}
