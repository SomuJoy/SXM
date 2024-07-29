import { Injectable } from '@angular/core';
import { LoadRtdStreamingData, selectProgramCode } from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { getSelectedProvince, provinceChanged } from '@de-care/domains/customer/state-locale';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, pairwise, withLatestFrom } from 'rxjs/operators';
import { loadRTDStreamingDataWorkflowError, loadRTDStreamingDataWorkflowSuccess, provinceChangedInCanada, provinceChangedToOrFromQuebec } from '../internal.actions';

export const isProvinceChangedToOrFromQuebec = (previousProvince: string, currentProvince: string) => (previousProvince === 'QC') !== (currentProvince === 'QC');

@Injectable({
    providedIn: 'root'
})
export class ProvinceEffect {
    constructor(private readonly _store: Store, private readonly _actions$: Actions, private readonly _loadRTDStreamingDataWorkflow: LoadRtdStreamingData) {}

    provinceChangedInCanada$ = createEffect(() =>
        this._actions$.pipe(
            ofType(provinceChanged),
            withLatestFrom(this._store.pipe(select(getIsCanadaMode))),
            filter(([_, isCanadaMode]) => isCanadaMode),
            map(() => provinceChangedInCanada())
        )
    );

    provinceChangedToOrFromQuebec$ = createEffect(() =>
        this._actions$.pipe(
            ofType(provinceChangedInCanada),
            withLatestFrom(this._store.pipe(select(getSelectedProvince), pairwise())),
            filter(([_, [previousProvince, currentProvince]]) => isProvinceChangedToOrFromQuebec(previousProvince, currentProvince)),
            map(() => provinceChangedToOrFromQuebec())
        )
    );

    loadRTDStreamingData$ = createEffect(() =>
        this._actions$.pipe(
            ofType(provinceChangedToOrFromQuebec),
            withLatestFrom(this._store.pipe(select(getSelectedProvince)), this._store.pipe(select(selectProgramCode))),
            concatMap(([_, province, programCode]) => this._loadRTDStreamingDataWorkflow.build({ province, programCode })),
            map(() => loadRTDStreamingDataWorkflowSuccess()),
            catchError(() => of(loadRTDStreamingDataWorkflowError()))
        )
    );
}
