import { Injectable } from '@angular/core';
import { DataTrackerService } from '@de-care/shared/data-tracker';
import { DataLayerActionEnum } from '../../../enums';
import { behaviorEventReactionRefreshSignalBySignal, behaviorEventReactionRefreshSignalByText } from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RrefreshSignalEffects {
    constructor(private readonly _actions$: Actions, private readonly _eventTrackService: DataTrackerService) {}

    refreshSignalBySignal$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionRefreshSignalBySignal),
                tap(() => {
                    this._eventTrackService.trackEvent(DataLayerActionEnum.RefreshSignalSent, {});
                })
            ),
        { dispatch: false }
    );

    refreshSignalByText$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionRefreshSignalByText),
                tap(() => {
                    this._eventTrackService.trackEvent(DataLayerActionEnum.RefreshTextSent, {});
                })
            ),
        { dispatch: false }
    );
}
