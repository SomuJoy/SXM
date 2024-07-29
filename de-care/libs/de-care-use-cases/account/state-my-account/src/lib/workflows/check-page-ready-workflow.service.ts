import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { getHasAccountState } from '../state/state.selectors';

@Injectable({ providedIn: 'root' })
export class CheckPageReadyWorkflowService implements DataWorkflow<null, boolean> {
    constructor(private readonly _store: Store) {}

    build(): Observable<boolean> {
        return this._store.select(getHasAccountState).pipe(
            take(1),
            tap((hasAccountState) => {
                if (hasAccountState) {
                    this._store.dispatch(pageDataFinishedLoading());
                }
            })
        );
    }
}
