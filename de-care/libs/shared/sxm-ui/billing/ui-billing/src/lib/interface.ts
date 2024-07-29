export interface BillingData {
    lastAmount?: string;
    lastDate?: string;
    amount?: string;
    date: string;
    daysDue?: number;
    daysSinceLastPayment?: number;
    isPastDue?: boolean;
    currentBalance?: number;
    showReactivateWarning?: boolean;
}
