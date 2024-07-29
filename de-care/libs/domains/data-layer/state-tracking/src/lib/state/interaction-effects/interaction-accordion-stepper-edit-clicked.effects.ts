import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { behaviorEventInteractionEditClick } from '@de-care/shared/state-behavior-events';
import { LegacyDataLayerService } from '../../legacy-data-layer.service';
import { DataTrackerService } from '@de-care/shared/data-tracker';
import { DataLayerActionEnum, DataLayerDataTypeEnum } from '../../enums';

@Injectable({ providedIn: 'root' })
export class InteractionAccordionStepperEditClicked {
    constructor(
        private readonly _actions$: Actions,
        private readonly _legacyDataLayerService: LegacyDataLayerService,
        private readonly _eventTrackService: DataTrackerService
    ) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventInteractionEditClick),
                tap(({ componentNametoEdit }) => {
                    this._eventTrackService.trackEvent(DataLayerActionEnum.AccordionEdit, {
                        previousStepId: this._legacyDataLayerService.getData(DataLayerDataTypeEnum.PageInfo).componentName,
                        currentStepId: componentNametoEdit,
                    });
                })
            ),
        { dispatch: false }
    );
}
