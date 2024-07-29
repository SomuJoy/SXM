import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getBillingHistoryForDataSource } from '@de-care/de-care-use-cases/account/state-my-account-billing';

export interface BillingDateSet {
    datetime: number;
    amount: number;
    invoiceNumber?: string;
    records: BillingItemSet[];
    isExpanded: boolean;
    hasDetails: boolean;
    description?: string;
}

export interface BillingItemSet {
    name: string;
    amount: number;
    lineItems: BillingLineItem[];
}
export interface BillingLineItem {
    description: string;
    amount: number;
}

@Injectable({ providedIn: 'root' })
export class BillingRecordsDataSource extends DataSource<BillingDateSet> {
    data = this._store.select(getBillingHistoryForDataSource);

    constructor(private readonly _store: Store) {
        super();
    }

    connect(): Observable<BillingDateSet[]> {
        return this.data;
    }

    disconnect() {
        // TODO: add clean up logic if needed
    }
}
