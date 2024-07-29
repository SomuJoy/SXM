import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { LoadFreeListenCampaignWorkflowErrors, LoadFreeListenCampaignWorkflowService } from '@de-care/domains/offers/state-offers';
import { selectInboundQueryParamsFreeListenCampaignId } from '../state/selectors';
import { catchError, concatMap, map, mapTo, take, tap } from 'rxjs/operators';
import { setFreeListenCampaign } from '../state/actions';
import { processInboundQueryParams } from '../state/public.actions';

export type LoadFreeListenSetupDataWorkflowErrors = 'PROMO_CODE_NOT_FOUND' | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class LoadFreeListenSetupDataWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store, private readonly _loadFreeListenCampaignWorkflowService: LoadFreeListenCampaignWorkflowService) {}

    build(): Observable<boolean> {
        this._store.dispatch(processInboundQueryParams());
        return this._store.select(selectInboundQueryParamsFreeListenCampaignId).pipe(
            take(1),
            concatMap((promoCode) =>
                this._loadFreeListenCampaignWorkflowService.build({ promoCode }).pipe(map(({ endDate, isActive }) => ({ promoCode, endDate, isActive })))
            ),
            tap((campaignInfo) => {
                this._store.dispatch(setFreeListenCampaign(campaignInfo));
                this._store.dispatch(pageDataFinishedLoading());
            }),
            mapTo(true),
            catchError((error: LoadFreeListenCampaignWorkflowErrors) => {
                // TODO: add error type mapping here to return type of LoadFreeListenSetupDataWorkflowErrors
                return throwError(error);
            })
        );
    }
}
