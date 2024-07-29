import { Detail, Quote } from '@de-care/domains/quotes/state-quote';
import { QuoteViewModel } from './quote-presentment.interface';
import { FeeViewModel, QuoteExtraData, UpgradeFeeViewModel } from './shared-presentment.interface';

export interface ProRatedRenewalQuoteDetailsViewModel extends Detail {
    displayProperties?: ProRatedRenewalQuoteDetailDisplayProperties;
}

export interface ProRatedRenewalQuoteDetailDisplayProperties {
    hasBalance?: boolean;
    shouldShowDetailsDropDown?: boolean;
    shouldShowGiftCardQuote?: boolean;
    shouldShowNoCurrentBalance?: boolean;
    termAndPriceText?: string;
    showPackageDescription?: boolean;
    showPreviousBalance?: boolean;
    showCredit?: boolean;
    shouldShowDetailPackageName?: boolean;
}

export interface ProRatedRenewalQuoteComponentViewModel extends Omit<QuoteViewModel, 'quote'> {
    quote: ProRatedRenewalQuoteViewModel;
    extraData?: QuoteExtraData;
}

export interface ProRatedRenewalQuoteViewModel extends Quote {
    displayProperties?: ProRatedRenewalQuoteDisplayProperties;
    details: ProRatedRenewalQuoteDetailsViewModel[];
    fees: FeeViewModel[];
    upgradeFees?: UpgradeFeeViewModel[];
}

export interface ProRatedRenewalQuoteDisplayProperties {
    headerClass?: string;
    isFooterPresent?: boolean;
    isOpened?: boolean;
    quoteHeading?: string;
    shouldShowMainAccordion?: boolean;
    shouldShowQuoteHeading?: boolean;
    showNonUpgradeHeadline?: boolean;
    shouldShowUpgradeFees?: boolean;
    absCurrentBalance?: number;
    shouldShowDetailsDropDown?: boolean;
    showFeesAndTaxes?: boolean;
}

export interface ProRatedRenewalQuoteInputViewModel {
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
