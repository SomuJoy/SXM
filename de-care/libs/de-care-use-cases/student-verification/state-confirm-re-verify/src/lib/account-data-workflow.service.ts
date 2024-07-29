import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { selectAccount } from '@de-care/domains/account/state-account';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AccountDataWorkflowService implements DataWorkflow<null, boolean> {
    constructor(private _store: Store) {}

    build() {
        return this._store.select(selectAccount).pipe(map(account => !!account));
    }
}
