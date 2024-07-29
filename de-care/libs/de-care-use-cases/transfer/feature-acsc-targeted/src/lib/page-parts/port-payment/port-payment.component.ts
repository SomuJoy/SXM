import { Component, EventEmitter, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getSubscriptionAfterTrialDetails, getSubmitTransactionAsProcessing, selectAccountData } from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { withLatestFrom, map, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

export interface PaymentInfoSubmission {
    paymentForm: {
        billingAddress: {
            addressLine1: string;
            city: string;
            state: string;
            zip: string;
        };
        ccExpDate: string;
        ccName: string;
        ccNum: string;
    };
    useCardOnFile: boolean;
}
@Component({
    selector: 'de-care-port-payment',
    templateUrl: './port-payment.component.html',
    styleUrls: ['./port-payment.component.scss'],
})
export class PortPaymentComponent {
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.PortPaymentComponent.';
    ymmOrRadioId: string;
    resumeDate: string;
    serviceError = false;
    @Output() paymentFormCompleted = new EventEmitter();
    subscriptionAfterTrialDetails$ = this._store.pipe(
        select(getSubscriptionAfterTrialDetails),
        withLatestFrom(this._translateService.stream(`${this.translateKeyPrefix}SUBSCRIPTION_DETAILS`)),
        tap(([detailData, detailText]) => {
            this.ymmOrRadioId = detailData?.trialYmm ?? detailText?.['RADIO_ID'] + detailData?.trialRadioId;
            this.resumeDate = detailText?.['DATE'] + detailData?.trialEndDate;
        }),
        map(([detailData, detailText]) => {
            return {
                eyebrow: detailText?.['EYEBROW'],
                title: detailData.title,
            };
        })
    );
    selectAccount$ = this._store.pipe(select(selectAccountData));
    getSubmitTransactionAsProcessing$ = this._store.pipe(select(getSubmitTransactionAsProcessing));
    constructor(private readonly _store: Store, private readonly _translateService: TranslateService) {}

    onPaymentFormComplete(paymentInfo: PaymentInfoSubmission) {
        this.paymentFormCompleted.emit(paymentInfo);
        this.serviceError = false;
    }
}
