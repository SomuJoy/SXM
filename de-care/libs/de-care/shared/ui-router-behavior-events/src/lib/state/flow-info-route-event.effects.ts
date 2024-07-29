import { Injectable } from '@angular/core';
import { behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';
import { createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { RouteDataFlowInfo } from '../constants';
import { selectRouteDataFlowInfo } from './selectors';

@Injectable({ providedIn: 'root' })
export class FlowInfoRouteEventEffects {
    constructor(private readonly _store: Store) {}

    transactionStarted$ = createEffect(() =>
        this._store.pipe(
            select(selectRouteDataFlowInfo),
            filter((flowInfo) => !!flowInfo?.flowName),
            distinctUntilChanged(),
            map(({ flowName, flowVariation }: RouteDataFlowInfo) => behaviorEventReactionFeatureTransactionStarted({ flowName, flowVariation }))
        )
    );
}
