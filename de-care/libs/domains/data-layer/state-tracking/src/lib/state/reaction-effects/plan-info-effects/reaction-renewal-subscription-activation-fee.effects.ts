import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventReactionQuoteRenewalSubscriptionActivationFee } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';
import { Injectable } from '@angular/core';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionRenewalSubscriptionActivationFeeEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionQuoteRenewalSubscriptionActivationFee),
                tap(({ fee }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.PlanInfo, {
                        products: {
                            renewalPlan: {
                                activationFee: fee,
                            },
                        },
                    });
                })
            ),
        { dispatch: false }
    );
}
