export interface SubscriptionSummaryData {
    last4DigitsOfAccountNumber: string;
    last4DigitsOfRadioId: string;
    vehicleInfo?: { year?: string; make?: string; model?: string };
    packageNames: string[];
    email: string;
}
