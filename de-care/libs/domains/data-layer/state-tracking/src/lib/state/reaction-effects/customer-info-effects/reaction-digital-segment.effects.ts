import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { behaviorEventReactionForDigitalSegment } from '@de-care/shared/state-behavior-events';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionDigitalSegmentEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService, private readonly _dataLayerService: DataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionForDigitalSegment),
                tap(({ digitalSegment }) => {
                    this._legacyDataLayerService.eventTrack('customerInfo', {
                        digitalSegment,
                    });
                    this._dataLayerService.eventTrack('customer-info', {
                        customerInfo: { digitalSegment },
                    });
                })
            ),
        { dispatch: false }
    );
}
