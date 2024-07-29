import { Fee } from '@de-care/domains/quotes/state-quote';

export interface FeeViewModel extends Fee {
    displayProperties?: {
        isRoyaltyFee: boolean;
    };
}

export interface UpgradeFeeViewModel extends Fee {
    packageName: string;
    termLength: number;
    displayProperties?: {
        isFreeUpgrade: boolean;
    };
}

export interface QuoteExtraData {
    // For specific use-cases
    // Platinum VIP
    isBothRadios?: boolean;
    isPlatinumVIP?: boolean;
    showTotalAsPaid?: boolean;
    isUpgradePkg?: boolean;
    isAnnual?: boolean;
    // Generic data to avoid maintaining all the flags for each component
    isAcsc?: boolean;
    isFlepz?: boolean;
}
