import { AddressModel } from './address.model';

export interface QuoteRequestModel {
    planCodes: string[];
    renewalPlanCode?: string;
    radioId: string;
    serviceAddress?: AddressModel;
    subscriptionId?: string;
    followOnPlanCodes?: string[];
}

export interface QuoteModel {
    readonly id?: number | string;
    grandTotalAmmount: number;
    grandTotalTaxAmount: number;
    currentQuote: ChildQuoteModel;
    renewalQuote: ChildQuoteModel;
    proRatedRenewalQuote: ChildQuoteModel;
    futureQuote: ChildQuoteModel;
    fees: ChildQuoteFeeModel[];
    taxes: ChildQuoteTaxModel[];
    totalTaxesAndFeesAmount: number;
}

export interface ChildQuoteModel {
    type: string;
    totalTaxAmount: number;
    totalFeesAmount: number;
    totalAmount: number;
    totalTaxesAndFeesAmount: number;
    discountAmount: number;
    pricePerMonth: number;
    currentBalance: number;
    previousBalance: number;
    fees: ChildQuoteFeeModel[];
    taxes: ChildQuoteTaxModel[];
    consolidatedCreditAmount?: number;
    details: ChildQuoteDetailsModel[];
    isProrated: boolean;
    isUpgraded: boolean;
}

export interface ChildQuoteFeeModel {
    description: string;
    amount: number;
}

export interface ChildQuoteTaxModel {
    description: string;
    amount: number;
}

export interface ChildQuoteDetailsModel {
    planCode: string;
    packageName: string;
    termLength: number;
    priceAmount: number;
    taxAmount: number;
    feeAmount: number;
    fees: ChildQuoteFeeModel[];
    taxes: ChildQuoteTaxModel[];
    startDate: string;
    endDate: string;
    isMilitary?: boolean;
}
