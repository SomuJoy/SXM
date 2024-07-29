import { Detail, Quote } from '@de-care/domains/quotes/state-quote';
import { QuoteViewModel } from './quote-presentment.interface';
import { FeeViewModel, QuoteExtraData, UpgradeFeeViewModel } from './shared-presentment.interface';

export interface RenewalQuoteDetailsViewModel extends Detail {
    displayProperties?: RenewalQuoteDetailDisplayProperties;
}

export interface RenewalQuoteDetailDisplayProperties {
    hasBalance: boolean;
    showUpgradeFee: boolean;
    shouldShowMCPAndTheLikes: boolean;
    shouldShowNoCurrentBalance: boolean;
    shouldShowGiftCardQuote?: boolean;
    shouldShowDetailPackageName?: string;
    shouldShowDetailDealType?: string;
    noDetailPackageName?: boolean;
    shouldShowDetailsDropDown?: boolean;
    isDetailDropDownOpened?: boolean;
    termAndPriceText?: string;
    showCredit?: boolean;
    showPackageDescription?: boolean;
    showPreviousBalance?: boolean;
}

export interface RenewalQuoteComponentViewModel extends Omit<QuoteViewModel, 'quote'> {
    quote: RenewalQuoteViewModel;
    extraData?: QuoteExtraData;
}

export interface RenewalQuoteViewModel extends Quote {
    displayProperties?: RenewalQuoteDisplayProperties;
    details: RenewalQuoteDetailsViewModel[];
    fees: FeeViewModel[];
    upgradeFees?: UpgradeFeeViewModel[];
}

export interface RenewalQuoteDisplayProperties {
    headerClass?: string;
    isFooterPresent?: boolean;
    isOpened?: boolean;
    quoteHeading?: string;
    shouldShowMainAccordion?: boolean;
    shouldShowQuoteHeading?: boolean;
    showNonUpgradeHeadline?: boolean;
    showCancelTexForStreaming?: boolean;

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
    currentBalance?: number;
    showFeesAndTaxes?: boolean;
    shouldShowDetailsDropDown?: boolean;
}

export interface RenewalQuoteInputViewModel {
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
    leadOfferHasEtfAmount: boolean;

    extraData?: QuoteExtraData;
}
