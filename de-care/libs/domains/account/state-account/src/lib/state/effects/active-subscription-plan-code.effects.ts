import { Injectable } from '@angular/core';
import { ofType, Actions, createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { behaviorEventReactionActiveSubscriptionPlanCodes } from '@de-care/shared/state-behavior-events';
import { getFirstAccountSubscriptionPlanCodes, getHasAnySCEligible } from '../selectors';
import { setAccount } from '../actions';

@Injectable()
export class ActiveSubscriptionPlanCodeEffects {
    constructor(private _actions$: Actions, private _store: Store) {}

    effect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setAccount),
            withLatestFrom(this._store.pipe(select(getFirstAccountSubscriptionPlanCodes)), this._store.pipe(select(getHasAnySCEligible))),
            // if this is the ACSC flow do not automatically set the first subscription plan in the datalayer,
            // the ACSC effects file will take care of populating the datalayer with the correct plan
            filter(([, , hasAnySCEligible]) => !hasAnySCEligible),
            map(([_, plans]) => behaviorEventReactionActiveSubscriptionPlanCodes({ plans }))
        )
    );
}
