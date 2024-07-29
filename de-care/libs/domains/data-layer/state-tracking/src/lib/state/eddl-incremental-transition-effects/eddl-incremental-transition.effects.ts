import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataLayerService } from '../../data-layer.service';
import { filter, tap } from 'rxjs/operators';
import {
    behaviorEventImpressionForComponent,
    behaviorEventReactionFeatureTransactionStarted,
    behaviorEventReactionForOffers,
    behaviorEventReactionForProgramCode,
} from '@de-care/shared/state-behavior-events';
import { pipe } from 'rxjs';
import { LegacyDataLayerService } from '../../legacy-data-layer.service';
import { DataLayerDataTypeEnum } from '../../enums';

@Injectable({ providedIn: 'root' })
export class EddlIncrementalTransitionEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService, private readonly _dataLayerService: DataLayerService) {}

    private _filter$ = pipe(filter(() => this._dataLayerService.flowName === 'checkoutstreamingorganicvariant2'));

    flow$ = createEffect(
        () =>
            this._actions$.pipe(
                this._filter$,
                ofType(behaviorEventReactionFeatureTransactionStarted),
                tap(({ flowName }) => this._updatePropInLegacy(DataLayerDataTypeEnum.PageInfo, 'flowName', 'AUTHENTICATE'))
            ),
        { dispatch: false }
    );
    flowByComponentName$ = createEffect(
        () =>
            this._actions$.pipe(
                this._filter$,
                ofType(behaviorEventImpressionForComponent),
                tap(({ componentName }) => {
                    const flowName = ['offerpresentmentstep', 'accountlookupinterstitialstep', 'accountlookup'].includes(componentName) ? 'AUTHENTICATE' : 'CHECKOUT';
                    this._updatePropInLegacy(DataLayerDataTypeEnum.PageInfo, 'flowName', flowName);
                })
            ),
        { dispatch: false }
    );
    programCode$ = createEffect(
        () =>
            this._actions$.pipe(
                this._filter$,
                ofType(behaviorEventReactionForProgramCode),
                tap(({ programCode }) => this._updatePropInLegacy(DataLayerDataTypeEnum.DeviceInfo, 'programCode', programCode))
            ),
        { dispatch: false }
    );
    offers$ = createEffect(
        () =>
            this._actions$.pipe(
                this._filter$,
                ofType(behaviorEventReactionForOffers),
                tap(({ audioPackages }) => this._updatePropInLegacy(DataLayerDataTypeEnum.OfferData, 'offers', audioPackages))
            ),
        { dispatch: false }
    );

    private _updatePropInLegacy(type: DataLayerDataTypeEnum, key, value) {
        let d = this._legacyDataLayerService.getData(type);
        if (d) {
            d[key] = value;
        } else {
            d = { [key]: value };
        }
        this._legacyDataLayerService.eventTrack(type, d);
    }
}
