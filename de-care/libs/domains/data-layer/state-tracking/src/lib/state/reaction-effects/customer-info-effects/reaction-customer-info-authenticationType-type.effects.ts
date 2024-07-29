import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventReactionCustomerInfoAuthenticationType } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';
import { Injectable } from '@angular/core';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionCustomerInfoAuthenticationTypeTypeEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionCustomerInfoAuthenticationType),
                tap(({ authenticationType }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.CustomerInfo, {
                        authenticationType: authenticationType,
                    });
                })
            ),
        { dispatch: false }
    );
}
