import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { LegacyDataLayerService } from '../../legacy-data-layer.service';
import { DataLayerService } from '../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class ImpressionComponentEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService, private readonly _dataLayerService: DataLayerService) {}

    /**
     * @deprecated code will be removed once Adobe Launch is configured to use new event based system
     */
    impressionForComponentLegacy$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventImpressionForComponent),
                tap(({ componentName }) => {
                    this._legacyDataLayerService.componentTrack(componentName);
                })
            ),
        { dispatch: false }
    );

    impressionForComponent$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventImpressionForComponent),
                tap(({ componentName }) => {
                    this._dataLayerService.componentTrack({ componentName: componentName });
                })
            ),
        { dispatch: false }
    );
}
