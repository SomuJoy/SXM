import { Component, Input } from '@angular/core';
import { getIsStreaming, getSelectedStreamingAccount } from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

export type AddSecondRadioOrderSummaryComponentData = {
    isSelfPaid: boolean;
    pricePerMonth: number;
    paymentStartDate: string;
    packageName: string;
    hasBalance: boolean;
    balance: number;
    vehicleInfo: {
        year: number;
        make: string;
        model: string;
    };
    last4DigitsOfRadioId: string;
};

@Component({
    selector: 'add-second-radio-order-summary',
    templateUrl: './add-second-radio-order-summary.component.html',
    styleUrls: ['./add-second-radio-order-summary.component.scss'],
})
export class AddSecondRadioOrderSummaryComponent {
    @Input() data: AddSecondRadioOrderSummaryComponentData;
    @Input() lang: string;

    isStreaming$ = this._store.select(getIsStreaming);
    selectedStreamingAccount$ = this._store.select(getSelectedStreamingAccount);
    isNewStreaming$ = this.selectedStreamingAccount$.pipe(filter((acc) => !!acc?.password));

    constructor(private _store: Store) {}
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeVipModule.AddSecondRadioOrderSummaryComponent.';
}
