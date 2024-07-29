import { Quote } from '@de-care/domains/quotes/state-quote';

export interface QuoteTpModel {
    amount?: string;
    isMrdEligible?: boolean;
    term?: string;
    startDate?: string;
    endDate?: string;
}
export interface QuoteViewModel {
    index: number;
    headlinePresent: boolean;
    quoteType: string;
    quoteLangKey: string;
    quote: Quote;
    originalAmount: number;
    originalStartDate: string;
    originalEndDate: string;
    QuoteTp: QuoteTpModel | any;
    hasBalance: boolean;
    hasCredit: boolean;
    isMCP: boolean;
    termLength: number;
    endDateForNote?: string;
    isStudentQuote?: boolean;
}

export interface QuoteMapViewModel {
    currentQuote: QuoteViewModel;
    futureQuote: QuoteViewModel;
    promoRenewalQuote: QuoteViewModel;
    proRatedRenewalQuote: QuoteViewModel;
    renewalQuote: QuoteViewModel;
}
