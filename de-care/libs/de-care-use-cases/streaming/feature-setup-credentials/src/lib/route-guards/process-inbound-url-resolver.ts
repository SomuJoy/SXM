import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { processInboundQueryParams } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { Store } from '@ngrx/store';

@Injectable()
export class ProcessInboundUrlResolver implements Resolve<void> {
    constructor(private readonly _store: Store) {}

    resolve(): void {
        this._store.dispatch(processInboundQueryParams());
    }
}
