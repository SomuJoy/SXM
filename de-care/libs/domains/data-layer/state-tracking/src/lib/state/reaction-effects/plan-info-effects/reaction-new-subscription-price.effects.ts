import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventReactionQuoteNewSubscriptionPrice } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';
import { Injectable } from '@angular/core';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionNewSubscriptionPriceEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionQuoteNewSubscriptionPrice),
                tap(({ price }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.PlanInfo, {
                        products: {
                            purchasePlan: {
                                price: price,
                            },
                        },
                    });
                })
            ),
        { dispatch: false }
    );
}
