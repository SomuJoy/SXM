export interface Sl2CState {
    vin: string | null;
    last4digitsOfRadioId: string | null;
    corpId: string | null;
    expiryDate: string | null;
    submissionIsProcessing: boolean;
    firstSubscriptionID: string;
}
