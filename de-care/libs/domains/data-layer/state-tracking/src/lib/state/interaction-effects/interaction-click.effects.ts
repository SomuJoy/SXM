import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { behaviorEventInteractionLinkClick } from '@de-care/shared/state-behavior-events';
import { DataLayerService } from '../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class InteractionClickEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService) {}

    interactionLinkClick$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventInteractionLinkClick),
                tap(({ linkName, linkType, linkKey }) => {
                    this._dataLayerService.clickTrack({ linkName, linkType, ...(!!linkKey && { linkKey }) });
                })
            ),
        { dispatch: false }
    );
}
