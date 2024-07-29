import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DataFollowOnOffersService } from '../data-follow-on-offers.service';
import { loadFollowOnOffersError, setFollowOnOffers } from '../state/follow-on-offers.actions';

export type FollowOnPlanCodes = string[];
export type LoadFollowOnOffersForStreamingWorkflowRequest = {
    planCode: string;
    province?: string;
};
@Injectable({ providedIn: 'root' })
export class LoadFollowOnOffersForStreamingWorkflowService implements DataWorkflow<LoadFollowOnOffersForStreamingWorkflowRequest, FollowOnPlanCodes> {
    constructor(private readonly _store: Store, private readonly _dataFollowOnOffersService: DataFollowOnOffersService) {}

    build(request: LoadFollowOnOffersForStreamingWorkflowRequest): Observable<FollowOnPlanCodes> {
        return this._dataFollowOnOffersService.getFollowOnOffer({ streaming: true, ...request }).pipe(
            tap((response) => {
                this._store.dispatch(setFollowOnOffers({ followOnOffers: response.offers }));
            }),
            map(({ offers }) => (Array.isArray(offers) ? offers.map((offer) => offer.planCode) : [])),
            catchError((error) => {
                this._store.dispatch(loadFollowOnOffersError(error));
                return throwError(error);
            })
        );
    }
}
