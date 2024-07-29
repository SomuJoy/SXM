import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';
import { behaviorEventInteractionChevronClick } from '@de-care/shared/state-behavior-events';
import { DataTrackerService } from '@de-care/shared/data-tracker';

@Injectable({ providedIn: 'root' })
export class InteractionEffectChevronClicked {
    constructor(private readonly _actions$: Actions, private readonly _eventTrackService: DataTrackerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventInteractionChevronClick),
                map((action) => {
                    return { componentName: action.componentName, linkText: action.linkText };
                }),
                tap((data) => {
                    this._eventTrackService.trackEvent(data.linkText, { componentName: data.componentName });
                })
            ),
        { dispatch: false }
    );
}
