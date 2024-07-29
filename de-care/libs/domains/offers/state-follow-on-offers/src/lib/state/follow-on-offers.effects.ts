import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DataFollowOnOffersService, FollowOnRequestModel } from '../data-follow-on-offers.service';
import { loadFollowOnOffersError, loadFollowOnOffersForStreamingFromPlanCode, setFollowOnOffers } from './follow-on-offers.actions';

@Injectable()
export class FollowOnOffersEffects {
    constructor(private _actions$: Actions, private _dataFollowOnOffersService: DataFollowOnOffersService) {}

    loadFollowOnOffersForStreamingFromPlanCode$ = createEffect(() =>
        this._actions$.pipe(
            ofType(loadFollowOnOffersForStreamingFromPlanCode),
            map(({ planCode }) => ({ streaming: true, planCode })),
            mergeMap((request: FollowOnRequestModel) =>
                this._dataFollowOnOffersService.getFollowOnOffer(request).pipe(
                    map(response => setFollowOnOffers({ followOnOffers: response.offers })),
                    catchError(error => of(loadFollowOnOffersError(error)))
                )
            )
        )
    );
}
