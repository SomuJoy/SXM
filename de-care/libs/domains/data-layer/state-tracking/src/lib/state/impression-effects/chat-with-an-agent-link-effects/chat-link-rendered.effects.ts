import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventImpressionForChatLinkRendered } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class ChatLinkRenderedEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventImpressionForChatLinkRendered),
                tap(() => {
                    this._dataLayerService.eventTrack('dynamic-chat-link-rendered');
                })
            ),
        { dispatch: false }
    );
}
