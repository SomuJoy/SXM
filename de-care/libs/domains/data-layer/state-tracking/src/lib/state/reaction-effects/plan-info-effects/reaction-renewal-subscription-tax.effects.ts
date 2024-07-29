import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventReactionQuoteRenewalSubscriptionPrice, behaviorEventReactionQuoteRenewalSubscriptionTax } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';
import { Injectable } from '@angular/core';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionRenewalSubscriptionTaxEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionQuoteRenewalSubscriptionTax),
                tap(({ tax }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.PlanInfo, {
                        products: {
                            renewalPlan: {
                                tax,
                            },
                        },
                    });
                })
            ),
        { dispatch: false }
    );
}
