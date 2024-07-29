import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
    getSubscriptionInfo,
    getTransferFromInfo,
    selectAccountData,
    getLoadQuoteDataAsProcessing,
    getIsModeServiceContinuity,
    getRemoveOldRadioId,
    getHasNoInvoiceOrActiveCardOnFile,
    getHasNoActiveCardOnFile,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { SettingsService } from '@de-care/settings';

@Component({
    selector: 'de-care-choose-payment-method',
    templateUrl: './choose-payment-method.component.html',
    styleUrls: ['./choose-payment-method.component.scss'],
})
export class ChoosePaymentMethodComponent {
    subscriptionData$ = this._store.pipe(select(getSubscriptionInfo));
    transferFromData$ = this._store.pipe(select(getTransferFromInfo));
    selectAccount$ = this._store.pipe(select(selectAccountData));
    getIsModeServiceContinuity$ = this._store.pipe(select(getIsModeServiceContinuity));
    getRemoveOldRadioId$ = this._store.pipe(select(getRemoveOldRadioId));
    getLoadQuoteDataAsProcessing$ = this._store.pipe(select(getLoadQuoteDataAsProcessing));
    hasNoActiveCardOnFile$ = this._store.pipe(select(getHasNoActiveCardOnFile));
    hasNoInvoiceOrActiveCardOnFile$ = this._store.pipe(select(getHasNoInvoiceOrActiveCardOnFile));
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.ChoosePaymentMethodComponent.';
    allowInvoice: boolean;
    @Output() paymentFormCompleted = new EventEmitter<any>();
    @Input() ccError = false;

    constructor(private readonly _store: Store, private readonly _settingsService: SettingsService) {
        this.allowInvoice = !this._settingsService.isCanadaMode;
    }

    onPaymentFormComplete(evt) {
        this.paymentFormCompleted.emit(evt);
    }
}
