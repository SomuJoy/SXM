import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DataChangeOffersService } from '../../data-services/data-change-offers.service';
import { loadCustomerChangeSubscriptionOffers, loadOffersError, setOffers } from '../actions/load-offers.actions';

@Injectable()
export class LoadChangeSubscriptionOffersEffects {
    constructor(private _actions$: Actions, private _dataChangeOfferService: DataChangeOffersService) {}

    loadCustomerChangeSubscriptionOffers$ = createEffect(() =>
        this._actions$.pipe(
            ofType(loadCustomerChangeSubscriptionOffers),
            mergeMap(({ subscriptionId, province }) =>
                this._dataChangeOfferService.getCustomerChangeOffers({ subscriptionId, province }).pipe(
                    map(response => setOffers({ offers: response })),
                    catchError(error => of(loadOffersError(error)))
                )
            )
        )
    );
}
