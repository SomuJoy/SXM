import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';
import { behaviorEventReactionForPackageNamesPresented } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';

@Injectable({ providedIn: 'root' })
export class ReactionPresentedPlanNamesEffect {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionForPackageNamesPresented),
                tap(({ packages }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.PlanInfo, {
                        products: {
                            changeplan: {
                                packages,
                            },
                        },
                    });
                })
            ),
        { dispatch: false }
    );
}
