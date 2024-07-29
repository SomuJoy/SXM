export interface PrepaidRedeem {
    giftCardNumber: any;
    balance: number;
    currency: string;
    error: boolean;
}

export const initialPrepaidRedeemState: PrepaidRedeem = {
    giftCardNumber: null,
    balance: null,
    currency: null,
    error: null
};
