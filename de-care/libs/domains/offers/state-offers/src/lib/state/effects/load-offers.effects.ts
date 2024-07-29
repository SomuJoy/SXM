import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as LoadOffersActions from '../actions/load-offers.actions';
import { of } from 'rxjs';
import { DataOffersService } from '../../data-services/data-offers.service';

@Injectable()
export class LoadOffersEffects {
    constructor(private _actions$: Actions, private _dataOfferService: DataOffersService) {}

    loadRtdOfferFromProgramCode$ = createEffect(() =>
        this._actions$.pipe(
            ofType(LoadOffersActions.loadRtdTrialOffersFromProgramCode),
            map(({ programCode }) => ({
                programCode,
                streaming: true
            })),
            mergeMap(offerRequest =>
                this._dataOfferService.getOffers(offerRequest).pipe(
                    map(response => LoadOffersActions.setOffers({ offers: response })),
                    catchError(error => of(LoadOffersActions.loadOffersError({ error })))
                )
            )
        )
    );
}
