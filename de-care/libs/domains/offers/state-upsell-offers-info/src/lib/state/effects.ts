import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';
import { LoadUpsellOffersInfoWorkflowService } from '../workflows/load-upsell-offers-info-workflow.service';
import { loadUpsellOfferInfoForUpsellOffers } from './public.actions';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(private readonly _actions$: Actions, private readonly _loadUpsellOffersInfoWorkflowService: LoadUpsellOffersInfoWorkflowService) {}

    loadUpsellOfferInfoForUpsellOffers = createEffect(
        () =>
            this._actions$.pipe(
                ofType(loadUpsellOfferInfoForUpsellOffers),
                mergeMap(({ upsellOffersInfoRequest }) => this._loadUpsellOffersInfoWorkflowService.build(upsellOffersInfoRequest))
            ),
        { dispatch: false }
    );
}
