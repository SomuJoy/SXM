import { Detail, Quote } from '@de-care/domains/quotes/state-quote';
import { QuoteViewModel } from './quote-presentment.interface';
import { FeeViewModel, QuoteExtraData, UpgradeFeeViewModel } from './shared-presentment.interface';

export interface PromoRenewalQuoteDetailsViewModel extends Detail {
    displayProperties?: PromoRenewalQuoteDetailDisplayProperties;
}

export interface PromoRenewalQuoteDetailDisplayProperties {
    hasBalance?: boolean;
    shouldShowNoCurrentBalance?: boolean;
    notProrated?: boolean;
    price?: number;
    showCorrectOrderDetail?: boolean;
    termAndPriceText?: string;
    shouldShowGiftCardQuote?: boolean;
    showPreviousBalance?: boolean;
    showPackageDescription?: boolean;
    showCredit?: boolean;
    shouldShowAppleMusicFree?: boolean;
    shouldShowDetailDealType?: boolean;
}

export interface PromoRenewalQuoteComponentViewModel extends Omit<QuoteViewModel, 'quote'> {
    quote: PromoRenewalQuoteViewModel;
    extraData?: QuoteExtraData;
}

export interface PromoRenewalQuoteViewModel extends Quote {
    displayProperties?: PromoRenewalQuoteDisplayProperties;
    details: PromoRenewalQuoteDetailsViewModel[];
    fees: FeeViewModel[];
    upgradeFees?: UpgradeFeeViewModel[];
}

export interface PromoRenewalQuoteDisplayProperties {
    headerClass?: string;
    isFooterPresent?: boolean;
    isOpened?: boolean;
    quoteHeading?: string;
    shouldShowMainAccordion?: boolean;
    shouldShowQuoteHeading?: boolean;
    shouldShowUpgradeFees?: boolean;
    absCurrentBalance?: number;
    shouldShowDetailsDropDown?: boolean;
    showFeesAndTaxes?: boolean;
}

export interface PromoRenewalQuoteInputViewModel {
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

    extraData?: QuoteExtraData;
}
