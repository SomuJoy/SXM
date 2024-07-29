import { Injectable } from '@angular/core';
import { EXPERIENCE_KEY_FOR_PAGE_IMPRESSION } from '../constants';
import { behaviorEventReactionFeatureTransactionStarted, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { flatMap, map } from 'rxjs/operators';
import { clearFlepzData } from './actions';
import { findAccountPageInitialized, findAccountPageRendered } from './public.actions';

@Injectable()
export class FindAccountPageEffects {
    constructor(private readonly _actions$: Actions) {}

    initialized$ = createEffect(() =>
        this._actions$.pipe(
            ofType(findAccountPageInitialized),
            flatMap(() => [clearFlepzData(), behaviorEventReactionFeatureTransactionStarted({ flowName: EXPERIENCE_KEY_FOR_PAGE_IMPRESSION })])
        )
    );

    rendered$ = createEffect(() =>
        this._actions$.pipe(
            ofType(findAccountPageRendered),
            map(() => behaviorEventImpressionForComponent({ componentName: 'flepz' }))
        )
    );
}
