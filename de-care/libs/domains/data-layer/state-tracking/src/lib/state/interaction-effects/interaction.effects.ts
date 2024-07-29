import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { behaviorEventInteraction } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class InteractionEffects {
    constructor(private readonly _actions$: Actions) {}

    interaction$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventInteraction),
                tap(({ data }) => {
                    // TODO: capture in data layer
                })
            ),
        { dispatch: false }
    );
}
