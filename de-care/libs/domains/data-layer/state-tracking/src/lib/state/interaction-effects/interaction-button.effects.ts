import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { behaviorEventInteractionButtonClick } from '@de-care/shared/state-behavior-events';
import { LegacyDataLayerService } from '../../legacy-data-layer.service';
import { DataTrackerService } from '@de-care/shared/data-tracker';
import { DataLayerActionEnum, DataLayerDataTypeEnum } from '../../enums';

@Injectable({ providedIn: 'root' })
export class InteractionButtonEffects {
    constructor(
        private readonly _actions$: Actions,
        private readonly _legacyDataLayerService: LegacyDataLayerService,
        private readonly _eventTrackService: DataTrackerService
    ) {}

    interactionButtonClick$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventInteractionButtonClick),
                tap(({ data }) => {
                    this._eventTrackService.trackEvent(DataLayerActionEnum.GenericButtonClick, {
                        pageName: data.pageName || this._legacyDataLayerService.getData(DataLayerDataTypeEnum.PageInfo).flowName,
                        name: data.name,
                        positon: data.componentName || this._legacyDataLayerService.getData(DataLayerDataTypeEnum.PageInfo).componentName,
                    });
                })
            ),
        { dispatch: false }
    );
}
