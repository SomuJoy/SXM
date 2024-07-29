import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { behaviorEventImpressionForPage, behaviorEventImpressionForPageFlowName } from '@de-care/shared/state-behavior-events';
import { DataLayerService } from '../../data-layer.service';
import { LegacyDataLayerService } from '../../legacy-data-layer.service';

@Injectable({ providedIn: 'root' })
export class ImpressionPageEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    impressionForPageNew$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventImpressionForPage),
                tap(({ pageKey, componentKey }) => this._dataLayerService.pageTrack({ flowName: pageKey, componentName: componentKey }))
            ),
        { dispatch: false }
    );

    /**
     * @deprecated code will be removed once Adobe Launch is configured to use new event based system
     */
    impressionForPage$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventImpressionForPage),
                tap(({ pageKey, componentKey }) => {
                    this._legacyDataLayerService.pageTrack(pageKey, componentKey);
                })
            ),
        { dispatch: false }
    );

    impressionForPageFlowName$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventImpressionForPageFlowName),
                tap(({ flowName }) => {
                    this._legacyDataLayerService.setPageFlowName(flowName);
                })
            ),
        { dispatch: false }
    );
}
