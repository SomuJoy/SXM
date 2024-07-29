import { Injectable } from '@angular/core';
import { LoadAccountFromAccountDataWorkflow } from '@de-care/domains/account/state-account';
import { getPvtTime } from '@de-care/domains/utility/state-environment-info';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, mapTo, withLatestFrom } from 'rxjs/operators';
import { selectSelectedRadioIdLastFour } from '../state/selectors';

@Injectable({
    providedIn: 'root'
})
export class LoadAccountForSelectedRadioIdService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store, private readonly _loadAccountFromAccountDataWorkflow: LoadAccountFromAccountDataWorkflow) {}

    build(): Observable<boolean> {
        return this._store.select(selectSelectedRadioIdLastFour).pipe(
            withLatestFrom(this._store.select(getPvtTime)),
            map(([radioId, pvtTime]) => ({ pvtTime, radioId })),
            concatMap(request =>
                this._loadAccountFromAccountDataWorkflow.build(request).pipe(
                    mapTo(true),
                    catchError(error => {
                        return throwError(error);
                    })
                )
            )
        );
    }
}
