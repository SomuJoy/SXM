import { Injectable } from '@angular/core';
import { clearUpsellOffersInfo } from '@de-care/domains/offers/state-upsell-offers-info';
import { clearUpsells } from '@de-care/domains/offers/state-upsells';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, flatMap } from 'rxjs/operators';
import { LoadUpsellsWithCmsContentWorkflowService } from '../workflows/load-upsells-with-cms-content-workflow.service';
import { clearUpsellOffersWithCms, loadUpsellOffersWithCms } from './public.actions';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(private readonly _actions$: Actions, private readonly _loadUpsellsWithCmsContentWorkflowService: LoadUpsellsWithCmsContentWorkflowService) {}

    loadUpsellOfferInfoForUpsellOffers = createEffect(
        () =>
            this._actions$.pipe(
                ofType(loadUpsellOffersWithCms),
                concatMap(({ upsellsRequest }) => this._loadUpsellsWithCmsContentWorkflowService.build(upsellsRequest))
            ),
        { dispatch: false }
    );

    clearUpsellData$ = createEffect(() =>
        this._actions$.pipe(
            ofType(clearUpsellOffersWithCms),
            flatMap(() => [clearUpsells(), clearUpsellOffersInfo()])
        )
    );
}
