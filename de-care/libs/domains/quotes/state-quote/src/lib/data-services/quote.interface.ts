export interface QuoteModel {
    currentQuote: Quote;
    futureQuote: Quote;
    proRatedRenewalQuote: Quote;
    promoRenewalQuote: Quote;
    renewalQuote: Quote;
}

export interface Fee {
    amount: number;
    description: string;
}

export interface Tax {
    amount: number;
    description: string;
}

export interface UpgradeFee {
    feeAmount: number;
    planCode: string;
    packageName: string;
    termLength: number;
}

export interface Detail {
    type: string;
    dealType: string;
    balanceType: string;
    endDate: string;
    feeAmount: number;
    fees: Fee[];
    isMrdEligible: boolean;
    packageName: string;
    planCode: string;
    priceAmount: number;
    startDate: string;
    taxAmount: number;
    taxes: Tax[];
    termLength: number;
    totalTaxesAndFeesAmount: number;
    isStudent?: boolean;
    isAdvantage?: boolean;
    isMilitary?: boolean;
}

export interface Quote {
    currentBalance: number;
    details: Detail[];
    discountAmount: number;
    fees: Fee[];
    isProrated: boolean;
    isUpgraded: boolean;
    previousBalance: number;
    pricePerMonth: number;
    taxes: Tax[];
    totalAmount: number;
    totalFeesAmount: number;
    totalTaxAmount: number;
    totalTaxesAndFeesAmount: number;
    consolidatedCreditAmount?: number;
    packageUpgradeFees?: UpgradeFee[];
}

export enum FeesLabelEnum {
    Activation_Fee = 'Activation Fees',
    US_Music_Royalty_Fee = 'U.S. Music Royalty Fee',
    Canada_Music_Royalty_Fee = 'Music_Royalty_and_Administrative_Fee',
    Remaining_Service_Balance_Fee = 'Remaining Service Balance',
    Canada_Remaining_Service_Balance_Fee = 'Remaining_Service_Balance',
}

export enum QuoteDetailNamesEnum {
    Previous_Balance = 'Previous Balance',
    Reactivation_Charges = 'Reactivation Charges',
}
