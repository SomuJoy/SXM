import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';
import { LoadOffersInfoWorkflowService } from '../workflows/load-offers-info-workflow.service';
import { loadOfferInfoForOffers } from './public.actions';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(private readonly _actions$: Actions, private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService) {}

    loadOfferInfoForOffers = createEffect(
        () =>
            this._actions$.pipe(
                ofType(loadOfferInfoForOffers),
                mergeMap(({ offersInfoRequest }) => this._loadOffersInfoWorkflowService.build(offersInfoRequest))
            ),
        { dispatch: false }
    );
}
