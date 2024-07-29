import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventReactionForOffers, behaviorEventReactionForPreselectedPlan, behaviorEventReactionForOffersEligibility } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';
import { Injectable } from '@angular/core';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionOffersEffect {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService, private readonly _dataLayerService: DataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionForOffers),
                tap(({ audioPackages, dataPackages }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.OfferData, {
                        audioPackages: audioPackages,
                        dataPackages: dataPackages,
                    });
                })
            ),
        { dispatch: false }
    );

    eligibility$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionForOffersEligibility),
                tap(({ offers }) => {
                    this._dataLayerService.eventTrack('customer-eligibility-check', { offers });
                })
            ),
        { dispatch: false }
    );

    effectOffersUpdate$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionForPreselectedPlan),
                tap(({ audioPackage }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.OfferData, {
                        preSelectedPlan: { planCode: audioPackage?.planCode, price: audioPackage?.price, packageName: audioPackage?.packageName },
                    });
                })
            ),
        { dispatch: false }
    );
}
