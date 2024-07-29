import { Detail, Quote } from '@de-care/domains/quotes/state-quote';
import { QuoteViewModel } from './quote-presentment.interface';
import { FeeViewModel, QuoteExtraData, UpgradeFeeViewModel } from './shared-presentment.interface';

export interface CurrentQuoteDetailsViewModel extends Detail {
    displayProperties?: CurrentQuoteDetailDisplayProperties;
}

export interface CurrentQuoteDetailDisplayProperties {
    hasBalance: boolean;
    showUpgradeFee: boolean;
    shouldShowMCPAndTheLikes: boolean;
    shouldShowNoCurrentBalance: boolean;
    showCredit: boolean;
    shouldShowGiftCardQuote: boolean;
    shouldShowDetailPackageName: string;
    shouldShowDetailDealType: boolean;
    shouldShowDetailDealTypeDetails: boolean;
    shouldNotBoldPackageName: boolean;
    noDetailPackageName: boolean;
    termAndPriceText: string;
    termAndPriceSubText?: string;
    showPackageDescription?: boolean;
    showPreviousBalance?: boolean;
    shouldShowAppleMusicFree?: boolean;
    shouldShowDetailTermAndPrice?: boolean;
}

export interface CurrentQuoteComponentViewModel extends Omit<QuoteViewModel, 'quote'> {
    quote: CurrentQuoteViewModel;
    extraData?: QuoteExtraData;
}

export interface CurrentQuoteViewModel extends Quote {
    displayProperties?: CurrentQuoteDisplayProperties;
    details: CurrentQuoteDetailsViewModel[];
    fees: FeeViewModel[];
    upgradeFees?: UpgradeFeeViewModel[];
}

export interface CurrentQuoteDisplayProperties {
    headerClass?: string;
    isFooterPresent?: boolean;
    isOpened?: boolean;
    quoteHeading?: string;
    shouldShowMainAccordion?: boolean;
    shouldShowQuoteHeading?: boolean;
    showNonUpgradeHeadline?: boolean;

    balance?: number;
    balanceFormat?: string;
    absCurrentBalance?: number;
    isStudentRTPOffer?: boolean;
    notClosedorNew?: boolean;
    shouldShowCurrentBalance?: boolean;
    showGSTAndQST?: boolean;
    showHeadlineSeeOfferDetails?: boolean;
    showMCP?: boolean;
    shouldShowUpgradeFees?: boolean;
    showPromoPlan?: boolean;
    showQuoteCredit?: boolean;
    showStudentContainer?: boolean;
    showUnusedCredit?: number;
    endDateForNote?: string;
    isDetailDropDownOpened?: boolean;
    shouldShowDetailsDropDown?: boolean;
    currentBalance?: number;
    showFeesAndTaxes?: boolean;
    showTotalAsPaid?: boolean;
}

export interface CurrentQuoteInputViewModel {
    quoteVM: QuoteViewModel;

    isQuebec: boolean;
    isCanada: boolean;
    currentLang: string;
    promoPrice: string;
    tranlateFeesAndTaxes: boolean;

    expandOrderSummaryDetails: boolean;
    isMCP: boolean;
    showUnusedCreditLine: boolean;
    showHeadlineSeeOfferDetails: boolean;
    isClosedRadio: boolean;
    isNewAccount: boolean;
    isStreamingFlow: boolean;
    isChangeSubscription: boolean;
    isDataOnlyTrial: boolean;
    isClosedStreaming: boolean;
    isCurrentSubscriptionTrial: boolean;
    currentSubscriptionEndDate: string;
    extraData?: QuoteExtraData;
}
