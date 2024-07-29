import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { behaviorEventInteractionAmazonSupportLinkClick } from '@de-care/shared/state-behavior-events';
import { DataTrackerService } from '@de-care/shared/data-tracker';
import { DataLayerActionEnum } from '../../enums';

@Injectable({ providedIn: 'root' })
export class InteractionAmazonSupportClicked {
    constructor(private readonly _actions$: Actions, private readonly _eventTrackService: DataTrackerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventInteractionAmazonSupportLinkClick),
                tap(() => {
                    this._eventTrackService.trackEvent(DataLayerActionEnum.AmazonSupportLinkClick, {
                        link: 'visit our support page',
                    });
                })
            ),
        { dispatch: false }
    );
}
