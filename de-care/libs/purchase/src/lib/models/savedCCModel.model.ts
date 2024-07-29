import { PrepaidRedeem, PaymentInfoAddress, Flep } from '@de-care/purchase-state';
import { CheckoutTokenResolverErrors, CreditCardStatus } from '@de-care/data-services';

export class SavedCC {
    type: string;
    last4Digits: string;
    status: CreditCardStatus;
}
export class AddressFormModel {
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
}
export class SuggestedAddressFormModel extends AddressFormModel {
    addressLine2: string;
}
export class AddressValidation {
    currentAddress: object;
    suggestedAddress: object;
}

export class ReviewModel {
    packages: any;
    radioid: string;
    paymentInfo: any;
    giftCard: PrepaidRedeem;
    giftCardUsed: boolean;
    billingAddress: PaymentInfoAddress;
    serviceAddress?: PaymentInfoAddress;
    email: string;
    flep: Flep;
    streamingError: CheckoutTokenResolverErrors;
    isClosedRadio: boolean;
    isNewAccount: boolean;
    password?: string;
    subscriptionId?: string;
    isClosedStreaming: boolean;
    isTrial?: boolean;
    isDataOnlyTrial: boolean;
    leadOfferHastEtfAmmount?: boolean;
}
