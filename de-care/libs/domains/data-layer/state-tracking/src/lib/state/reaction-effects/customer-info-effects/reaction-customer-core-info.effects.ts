import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventReactionCustomerCoreInfo } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';
import { Injectable } from '@angular/core';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionCustomerCoreInfoEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService, private readonly _dataLayerService: DataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionCustomerCoreInfo),
                tap(({ firstName, lastName, email, phone, accountNumber }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.CustomerInfo, {
                        firstName,
                        lastName,
                        email,
                        phone,
                        accountNumber,
                    });
                    this._dataLayerService.eventTrack(DataLayerDataTypeEnum.CustomerInfo, {
                        firstName,
                        lastName,
                        email,
                        phone,
                        accountNumber,
                    });
                })
            ),
        { dispatch: false }
    );
}
