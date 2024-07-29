import { getAccountIsStreaming } from '@de-care/domains/account/state-account';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { behaviorEventReactionPresentmentTestCellInfo } from '@de-care/shared/state-behavior-events';
import { setPresentmentTestCell } from '../actions/load-presentment-offer-ids.actions';

@Injectable()
export class PresentmentTestCellBehaviorEffects {
    constructor(private _actions$: Actions, private _store: Store) {}

    effect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setPresentmentTestCell),
            withLatestFrom(this._store.pipe(select(getAccountIsStreaming))),
            map(([{ presentmentTestCell }, isStreaming]) => {
                const actionPayload = presentmentTestCell
                    ? { presentmentTestCell: [presentmentTestCell] }
                    : { presentmentTestCell: isStreaming ? ['no-test-streaming'] : ['no-test-satellite'] };
                return behaviorEventReactionPresentmentTestCellInfo(actionPayload);
            })
        )
    );
}
