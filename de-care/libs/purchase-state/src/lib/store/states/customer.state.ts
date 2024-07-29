import { PrepaidRedeem, initialPrepaidRedeemState } from './prepaid-redeem.state';

export interface CustomerInfo {
    name: string;
    address: {
        addressEntered: {
            addressLine1: string;
            addressLine2: string;
            city: string;
            state: string;
            zip: string;
            filled: boolean;
        };
        addressValidated: object;
    };
    payment: {
        useSavedCard: boolean;
        cardNumber: string;
        cardExpireMonth: string;
        cardExpireYear: string;
        prepaidCard: PrepaidRedeem;
    };
}

export const initialCustomerInfoState: CustomerInfo = {
    name: null,
    address: {
        addressEntered: {
            addressLine1: null,
            addressLine2: null,
            city: null,
            state: null,
            zip: null,
            filled: null
        },
        addressValidated: null
    },
    payment: {
        useSavedCard: null,
        cardNumber: null,
        cardExpireMonth: null,
        cardExpireYear: null,
        prepaidCard: initialPrepaidRedeemState
    }
};
