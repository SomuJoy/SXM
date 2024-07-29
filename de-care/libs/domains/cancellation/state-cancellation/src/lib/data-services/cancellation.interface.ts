// Not sure what will be returned from the microservice
export interface Cancellation {
    cancellationNumber: string;
    refundAmount: number;
    creditRemainingOnAccount: number;
    amountDue: number;
}
