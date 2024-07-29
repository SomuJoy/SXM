import { Injectable } from '@angular/core';
import { OemNavigationService } from '@de-care/de-oem/util-route';
import { DataPurchaseService, PurchaseSubscriptionDataModel } from '@de-care/data-services';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { PaymentInfo } from './data-models/payment-info';
import { BillingAddress } from './data-models/billing-address';
export interface SubmitResult {
    status: SubmitStatus;
}

export enum SubmitStatus {
    SUCCESS,
    GENERAL_ERROR,
    PAYMENT_ERROR,
}

export interface SubmitOrderPayload {
    radioIdLastFour: string;
    paymentInfo: PaymentInfo;
    billingAddress: BillingAddress;
    planCode: string;
    isClosedRadio: boolean;
}

@Injectable({ providedIn: 'root' })
export class OemFlowService {
    constructor(private _oemNavigationService: OemNavigationService, private _dataPurchaseService: DataPurchaseService) {}

    submitOrder({ radioIdLastFour, paymentInfo, billingAddress, planCode, isClosedRadio }: SubmitOrderPayload): Observable<SubmitResult> {
        const purchaseSubscriptionDataModel = this._buildCommonPurchaseSubscriptionDataModel(radioIdLastFour, paymentInfo, billingAddress);

        const plansToUse = [{ planCode }];
        let serviceCall$;
        if (isClosedRadio) {
            purchaseSubscriptionDataModel.plans = plansToUse;
            serviceCall$ = this._dataPurchaseService.addSubscription(purchaseSubscriptionDataModel);
        } else {
            purchaseSubscriptionDataModel.followOnPlans = plansToUse;
            serviceCall$ = this._dataPurchaseService.changeSubscription(purchaseSubscriptionDataModel);
        }

        return serviceCall$.pipe(
            mapTo({ status: SubmitStatus.SUCCESS }),
            catchError((response) =>
                this._dataPurchaseService.isCreditCardError(response.status, response.error.error.errorPropKey)
                    ? of({ status: SubmitStatus.PAYMENT_ERROR })
                    : of({ status: SubmitStatus.GENERAL_ERROR })
            )
        );
    }

    goToErrorPage(): void {
        this._oemNavigationService.goToErrorPage();
    }

    goToAccountPage(): void {
        this._oemNavigationService.goToManageAccount();
    }

    private _buildCommonPurchaseSubscriptionDataModel(radioIdLastFour: string, paymentInfo: PaymentInfo, billingAddress: BillingAddress): PurchaseSubscriptionDataModel {
        return {
            radioId: radioIdLastFour,
            paymentInfo: {
                useCardOnfile: false,
                cardInfo: {
                    nameOnCard: paymentInfo.nameOnCard,
                    cardNumber: paymentInfo.cardNumber.toString(),
                    expiryMonth: paymentInfo.expiryMonth,
                    expiryYear: paymentInfo.expiryYear,
                    securityCode: paymentInfo.securityCode,
                },
                paymentType: 'creditCard', // TODO: Make this magic string a type
            },
            billingAddress: {
                email: billingAddress.email,
                streetAddress: billingAddress.addressLine2 ? `${billingAddress.addressLine1} ${billingAddress.addressLine2}` : billingAddress.addressLine1,
                addressType: 'person', // TODO: Make this magic string a type
                postalCode: billingAddress.zip,
                city: billingAddress.city,
                state: billingAddress.state,
                country: billingAddress.country,
                avsvalidated: billingAddress.avsvalidated,
            },
            marketingPromoCode: null,
        };
    }
}
