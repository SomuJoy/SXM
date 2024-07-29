import { Actions, createEffect, ofType } from '@ngrx/effects';
import { flatMap } from 'rxjs/operators';
import { behaviorEventErrorFromUserInteraction, behaviorEventReactionAccountInfoFormClientSideValidationErrors } from '@de-care/shared/state-behavior-events';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReactionAccountInfoEffects {
    constructor(private readonly _actions$: Actions) {}

    clientSideValidationFailedEffectLegacy$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventReactionAccountInfoFormClientSideValidationErrors),
            flatMap(({ errors }) => {
                return errors.map(error => behaviorEventErrorFromUserInteraction({ message: error }));
            })
        )
    );
}
