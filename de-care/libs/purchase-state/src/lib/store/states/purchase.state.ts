import { PaymentInfo, initialPaymentInfoState } from './payment-info.state';
import { PackageUpgrades, initialPackageUpgradesState } from './package-upgrades.state';
import { ReviewOrder, initialReviewOrderState } from './review-order.state';
import { PrepaidRedeem, initialPrepaidRedeemState } from './prepaid-redeem.state';
import { Paymentform, initialPaymentFormState } from './payment-form.state';
import { DataState, initialDataState } from './data.state';

export interface PurchaseState {
    // customerInfo: CustomerInfo;
    paymentInfo: PaymentInfo;
    packageUpgrades: PackageUpgrades;
    reviewOrder: ReviewOrder;
    prepaidCard: PrepaidRedeem;
    formStatus: Paymentform;
    data: DataState;
    serviceError: any;
}

export const initialPurchaseState: PurchaseState = {
    // customerInfo: initialCustomerInfoState,
    prepaidCard: initialPrepaidRedeemState,
    packageUpgrades: initialPackageUpgradesState,
    paymentInfo: initialPaymentInfoState,
    reviewOrder: initialReviewOrderState,
    formStatus: initialPaymentFormState,
    data: initialDataState,
    serviceError: false
};

export function getInitialState() {
    return initialPurchaseState;
}
