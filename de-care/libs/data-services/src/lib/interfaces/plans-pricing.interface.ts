//********************************************************************************
export interface ICmsPlanPricing {
    type: string;
    program_id: string;
    plans: ICmsPlanPricingDetail[];
}

export interface ICmsPlanPricingDetail {
    type: string;
    id: string;
    name: string;
    descriptor: string;
    marketType: string;
    termLength: number;
    plan_id: string;
    eligibleForMrd: boolean;

    isPromotion: boolean;
    pricePerMonth: number;
    msrpPerMonth?: number;
    msrpTotal?: number;
    upfrontQuote?: number;
    echoDotValue?: number;
    savingsPercentage?: number;
    earlyTerminationFee?: number;

    quotes: {
        current_quote: ICmsPlanPricingQuotes;
        future_quote?: ICmsPlanPricingQuotes;
        renewal_quote: ICmsPlanPricingQuotes;
    };
}

export interface ICmsPlanPricingQuotes {
    type: string;

    pricePerMonthLineItem: {
        description: string;
        price: number;
    };

    serviceQuoteLineItem: {
        description: string;
        price: number;
    };

    taxQuoteLineItem: {
        description: string;
        price: number;
    };

    feeQuoteLineItems: [{
        description: string;
        price: number;
    }];

    total: {
        description: string;
        price: number;
    };

    startDate: number;
    endDate: number;
}