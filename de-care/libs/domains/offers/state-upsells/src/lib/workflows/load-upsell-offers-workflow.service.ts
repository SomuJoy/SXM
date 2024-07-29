import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { DataUpsellsService } from '../data-services/data-upsells.service';
import { loadUpsellOffersError, setUpsellOffers } from '../state/actions';

export interface WorkflowRequest {
    planCode: string;
    radioId?: string;
    streaming?: boolean;
    subscriptionId?: string;
    upsellCode?: string;
    satUpsellCode?: string;
    province?: string;
    retrieveFallbackOffer?: boolean;
}

@Injectable({ providedIn: 'root' })
export class LoadUpsellOffersWorkflowService implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(private readonly _dataUpsellsService: DataUpsellsService, private readonly _store: Store) {}

    build(request: WorkflowRequest): Observable<boolean> {
        return this._dataUpsellsService.getUpsellOffers(request).pipe(
            tap((upsellOffers) => {
                this._store.dispatch(setUpsellOffers({ upsellOffers }));
            }),
            catchError((error) => {
                this._store.dispatch(loadUpsellOffersError(error));
                return throwError(error);
            }),
            mapTo(true)
        );
    }
}
