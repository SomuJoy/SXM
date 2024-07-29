import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { behaviorEventReactionForPlanTerm } from '@de-care/shared/state-behavior-events';
import { setTermType } from '../actions';

@Injectable()
export class TermTypeEffects {
    effect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setTermType),
            map(({ termType }) => behaviorEventReactionForPlanTerm({ planTerm: termType }))
        )
    );

    constructor(private readonly _actions$: Actions, private readonly _store: Store) {}
}
