import { Detail, Quote } from '@de-care/domains/quotes/state-quote';
import { QuoteViewModel } from './quote-presentment.interface';
import { FeeViewModel, QuoteExtraData, UpgradeFeeViewModel } from './shared-presentment.interface';

export interface FutureQuoteDetailsViewModel extends Detail {
    displayProperties?: FutureQuoteDetailDisplayProperties;
}

export interface FutureQuoteDetailDisplayProperties {
    hasBalance?: boolean;
    shouldShowGiftCardQuote?: boolean;
    shouldShowNoCurrentBalance?: boolean;
    shouldShowDetailsDropDown?: boolean;
    isEligibleAndProrated?: boolean;
    noDetailPackageName?: boolean;
    isNotProrated?: boolean;
    isCanadaAndMCP?: boolean;
    price?: number;
    termAndPriceText?: string;
    showCredit?: boolean;
    showPreviousBalance?: boolean;
    showPackageDescription?: boolean;
    shouldShowDetailTermAndPrice?: boolean;
}

export interface FutureQuoteComponentViewModel extends Omit<QuoteViewModel, 'quote'> {
    quote: FutureQuoteViewModel;
}

export interface FutureQuoteViewModel extends Quote {
    displayProperties?: FutureQuoteDisplayProperties;
    details: FutureQuoteDetailsViewModel[];
    fees: FeeViewModel[];
    upgradeFees?: UpgradeFeeViewModel[];
}

export interface FutureQuoteDisplayProperties {
    headerClass?: string;
    isFooterPresent?: boolean;
    isOpened?: boolean;
    quoteHeading?: string;
    shouldShowMainAccordion?: boolean;
    shouldShowQuoteHeading?: boolean;
    shouldShowUpgradeFees?: boolean;
    absCurrentBalance?: number;
    showFeesAndTaxes?: boolean;
    shouldShowDetailsDropDown?: boolean;
    extraData?: QuoteExtraData;
}

export interface FutureQuoteInputViewModel {
    quoteVM: QuoteViewModel;

    isQuebec: boolean;
    isStudentFlow: boolean;
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

    extraData?: QuoteExtraData;
}
