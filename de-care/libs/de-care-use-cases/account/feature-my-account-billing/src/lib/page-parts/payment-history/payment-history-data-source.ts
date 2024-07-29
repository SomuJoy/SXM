import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getPaymentHistoryForDataSource } from '@de-care/de-care-use-cases/account/state-my-account-billing';

export interface PaymentRecord {
    datetime: number;
    amount: number;
    description: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentsDataSource extends DataSource<PaymentRecord> {
    data = this._store.select(getPaymentHistoryForDataSource);

    constructor(private readonly _store: Store) {
        super();
    }

    connect(): Observable<PaymentRecord[]> {
        return this.data;
    }

    disconnect() {
        // TODO: add clean up logic if needed
    }
}
